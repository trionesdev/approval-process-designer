import {define, observable, observe, reaction} from "@formily/reactive";
import Chance from 'chance';
import _ from "lodash";
import {GlobalStore} from "../store";
import {ApprovalProcessEngine} from "./ApprovalProcessEngine";

const chance = new Chance();

export type ProcessNodeType = 'START' | 'ROUTE' | 'CONDITION' | 'APPROVAL' | 'CC' | 'END'

export interface IProcessNode {
    engine?: ApprovalProcessEngine
    isSourceNode?: boolean
    id?: string
    type: ProcessNodeType
    componentName?: string
    nextNode?: IProcessNode
    conditionNodes?: IProcessNode[]
    title?: string
    description?: string
    props?: any
    defaultCondition?: boolean
}

const ProcessNodes = new Map<string, ProcessNode>()

export class ProcessNode {
    engine: ApprovalProcessEngine
    isSourceNode: boolean
    id: string
    type: ProcessNodeType
    componentName: string
    prevNodeId: string
    nextNode: ProcessNode
    conditionNodes: ProcessNode[]
    title: string
    description: string
    props: any
    defaultCondition?: boolean

    constructor(node: IProcessNode, parentNode?: ProcessNode) {
        this.engine = node.engine
        this.isSourceNode = node.isSourceNode
        this.id = node.id || `Activity_${chance.string({length: 10, alpha: true})}`
        this.type = node.type
        this.componentName = node.componentName || node.type
        this.prevNodeId = parentNode?.id
        this.nextNode = null
        this.conditionNodes = []
        this.title = node.title
        this.description = node.description
        this.props = node.props
        this.engine = parentNode?.engine
        this.defaultCondition = node.defaultCondition

        ProcessNodes.set(this.id, this)
        if (node) {
            this.from(node)
        }
        this.makeObservable()
    }

    makeObservable() {
        define(this, {
            prevNodeId: observable.ref,
            title: observable.ref,
            description: observable.ref,
            nextNode: observable.ref,
            conditionNodes: observable.shallow,
            props: observable
        })

        reaction(() => {
            return this.prevNodeId + this.title + this.description + this.nextNode?.id + this.conditionNodes.length
        }, () => {
            if (!this.isSourceNode) {
                this.engine.handleChange(`${this.id} something changed`)
            }
        })

        observe(this.props, (change) => {
            if (!this.isSourceNode) {
                this.engine.handleChange(`${this.id} props changed`)
            }
        })

    }

    setNextNode(node: ProcessNode) {
        if (!node) {
            this.nextNode = null
            return
        }


        node.nextNode = this.nextNode
        node.prevNodeId = this.id
        this.nextNode = node

    }

    setConditionNodes(nodes: ProcessNode[]) {
        if (_.isEmpty(nodes)) {
            return
        }
        _.forEach(nodes, (node) => {
            node.prevNodeId = this.id
        })
        this.conditionNodes = nodes
    }

    from(node?: IProcessNode) {
        if (!node) return
        if (node.id && node.id !== this.id) {
            ProcessNodes.delete(this.id)
            ProcessNodes.set(node.id, this)
            this.id = node.id
        }
        this.type = node.type
        this.componentName = node.componentName || node.type
        this.title = node.title
        this.description = node.description
        this.props = node.props ?? {}
        if (node.engine) {
            this.engine = node.engine
        }

        if (node.nextNode) {
            this.nextNode = new ProcessNode(node.nextNode, this)
        }
        if (node.conditionNodes && node.conditionNodes.length > 0) {
            this.conditionNodes = node.conditionNodes?.map((node) => {
                return new ProcessNode(node, this)
            }) || []
        }
    }

    clone(parentNode?: ProcessNode) {
        const node = new ProcessNode({
            type: this.type,
            componentName: this.componentName,
            title: this.title,
            description: this.description,
            props: _.cloneDeep(this.props),
        }, parentNode)
        if (this.type == 'ROUTE') {
            const conditionResource = GlobalStore.getConditionActivityResource()
            const firstCondition = conditionResource.node.clone(node)
            const conditionDefault = conditionResource.node.clone(node)
            // conditionDefault.props = _.assign(conditionDefault.props, {defaultCondition: true})
            conditionDefault.defaultCondition = true
            node.setConditionNodes([firstCondition, conditionDefault])
        }
        return node
    }

    cloneDeep(node?: ProcessNode) {
        if (!node) {
            return
        }
        const cloneNode = _.cloneDeep(node)
        ProcessNodes.set(cloneNode.id, cloneNode)
        return cloneNode;
    }

    remove() {
        const parentNode = ProcessNodes.get(this.prevNodeId)

        if (this.type == "CONDITION") { //当前节点是条件节点
            const linkedIds = this.collectLinkIds()
            if (parentNode.conditionNodes.length > 2) { //当分支超过2个时，只需要删除当前节点，否则，清除整个路由节点
                parentNode.conditionNodes = _.filter(parentNode.conditionNodes, (conditionNode: any) => {
                    return conditionNode.id !== this.id
                })
            } else {
                //只有2个分支的时候，删除当前分支所有链路节点，另一分支，如果有除了条件节点之外的节点，则保留，否则，清除整个路由节点
                const parentParentNode = ProcessNodes.get(parentNode.prevNodeId) //条件节点的父节点是路由节点，如果清除整个路由，需要找到父节点的父节点
                const parentNodeNextNode = parentNode.nextNode
                parentParentNode.setNextNode(null) //这里要断开节点链，否则可能造成递归渲染


                linkedIds.push(parentNode.id);
                const remainNode = _.find(parentNode.conditionNodes, (conditionNode: any) => {
                    return conditionNode.id !== this.id
                })
                const {deleteIds, startNode, endNode} = this.processRaminRouteBranch(remainNode)
                linkedIds.push(...deleteIds)
                if (startNode) {
                    parentParentNode.setNextNode(startNode)
                    endNode.setNextNode(parentNodeNextNode)
                } else {
                    parentParentNode?.setNextNode(parentNodeNextNode)
                }
            }
            _.forEach(linkedIds, (id: string) => {
                ProcessNodes.delete(id)
            })
        } else {
            if (this.nextNode) {
                this.nextNode.prevNodeId = this.prevNodeId
            }
            parentNode.nextNode = this.nextNode
            ProcessNodes.delete(this.id)
        }
    }

    /**
     * 添加条件分支
     */
    addConditionBranch() {
        if (this.type !== "ROUTE") {
            return
        }
        const conditionActivity = GlobalStore.getConditionActivityResource()?.node.clone(this)
        if (conditionActivity) {
            const newChildren = _.concat(this.conditionNodes.slice(0, this.conditionNodes.length - 1), conditionActivity, this.conditionNodes.slice(this.conditionNodes.length - 1))
            this.setConditionNodes(newChildren)
        }
    }

    /**
     * 获取下面链路上的所有节点id
     */
    collectLinkIds() {
        let ids = []
        if (this.nextNode) {
            ids.push(this.nextNode.id)
            ids = ids.concat(this.nextNode.collectLinkIds())
        }
        if (this.conditionNodes && this.conditionNodes.length > 0) {
            this.conditionNodes.forEach(child => {
                ids.push(child.id)
                ids = ids.concat(child.collectLinkIds())
            })
        }
        return ids
    }

    /**
     * 处理剩下的分支(default branch)，删除条件节点，保留其他节点
     * @param node
     */
    processRaminRouteBranch = (node: ProcessNode): {
        deleteIds?: string[],
        startNode?: ProcessNode,
        endNode?: ProcessNode
    } => {
        const ids = []
        const getStartNode = (node: ProcessNode) => {
            if (!node) {
                return null;
            }
            let startNode = node
            while (startNode?.type === 'CONDITION') {
                ids.push(startNode.id)
                startNode = startNode.nextNode
            }
            return startNode
        }

        const getEndNode = (node: ProcessNode) => {
            if (!node) {
                return null
            }
            let endNode = node
            while (endNode?.nextNode) {
                endNode = endNode.nextNode
            }
            return endNode
        }
        const startNode = getStartNode(node)
        const endNode = getEndNode(startNode)
        return {
            deleteIds: ids,
            startNode: startNode,
            endNode: endNode
        }
    }

    get index() {
        if (this.type === 'CONDITION') {
            const parentNode = ProcessNodes.get(this.prevNodeId)
            if (parentNode) {
                return parentNode.conditionNodes?.indexOf(this) || 0
            }
        }
        return null
    }

    isFirst() {
        if (this.type !== 'CONDITION') {
            return false
        }
        return this.index === 0
    }

    isLast() {
        if (this.type !== 'CONDITION') {
            return false
        }
        const parentNode = ProcessNodes.get(this.prevNodeId)
        return this.index === ((parentNode?.conditionNodes?.length || 0) - 1)
    }
}
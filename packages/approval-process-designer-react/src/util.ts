import {IResource, IResourceCreator} from "./types";
import _ from "lodash";
import {ProcessNode} from "./model";

export namespace DesignerCore {
    export function createResource(resource: IResourceCreator): IResource {
        return _.assign(resource, {
            node: new ProcessNode({
                isSourceNode: true,
                type: resource.type,
                componentName: resource.componentName,
                title: resource.title,
                description: resource.description,
                props: resource.props
            })
        })
    }

    export function transformToSchema(processNode: ProcessNode) {
        function toSchema(processNode: ProcessNode) {
            if (!processNode) {
                return null
            }
            return {
                id: processNode.id,
                prevNodeId: processNode.prevNodeId,
                type: processNode.type,
                componentName: processNode.componentName,
                title: processNode.title,
                description: processNode.description,
                props: _.isEmpty(processNode.props) ? null : processNode.props,
                nextNode: toSchema(processNode.nextNode),
                conditionNodes: processNode.conditionNodes?.map(toSchema) || [],
                defaultCondition: processNode.defaultCondition
            }
        }

        return toSchema(processNode)
    }
}
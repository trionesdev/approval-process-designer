import React, {useState} from 'react';
import './App.css';
import {
    ApprovalProcessDesigner, GlobalStore,
    IProcessNode,
    ProcessWidget, StudioPanel
} from "@trionesdev/approval-process-designer-react";
import {ApprovalActivity, ConditionActivity, RouteActivity, StartActivity, CcActivity} from "./activities";
import {Watermark} from "antd";
import * as Icons from "./activities/Icons"

function App() {
    const [data,setData] = useState<IProcessNode>({
        type: 'START',
        componentName: 'StartActivity',
        title: '发起人',
        nextNode: {
            type: 'APPROVAL',
            componentName: 'ApprovalActivity',
            title: '审批',
            nextNode: {
                type: 'ROUTE',
                componentName: 'RouteActivity',
                title: '路由',
                nextNode: {
                    type: 'CC',
                    componentName: 'CcActivity',
                    title: '抄送人',
                },
                conditionNodes: [
                    {
                        type: 'CONDITION',
                        componentName: 'ConditionActivity',
                        title: '条件1',
                        nextNode: {
                            type: 'APPROVAL',
                            componentName: 'ApprovalActivity',
                            title: '审批人',
                        }
                    },
                    {
                        type: 'CONDITION',
                        componentName: 'ConditionActivity',
                        defaultCondition: true,
                    }
                ]
            }
        }
    })
    const handleOnChange = (value: any) => {
        console.log("[processNode]", value)
        setData(value)
    }

    GlobalStore.registerIcons(Icons);
    return (
        <div>
            <Watermark style={{height: '100%'}} content={['书阙', '北斗开源']}>
                <ApprovalProcessDesigner value={data} onChange={handleOnChange}>
                    <StudioPanel>
                        <ProcessWidget activities={{
                            StartActivity,
                            ApprovalActivity,
                            RouteActivity,
                            ConditionActivity,
                            CcActivity
                        }}/>
                    </StudioPanel>
                </ApprovalProcessDesigner>
            </Watermark>
        </div>
    );
}

export default App;

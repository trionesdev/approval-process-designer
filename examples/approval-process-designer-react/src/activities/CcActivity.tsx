import {ActivityFC,CcActivity as TdCcActivity} from "@trionesdev/approval-process-designer-react";

export const CcActivity : ActivityFC<any> = TdCcActivity

CcActivity.Resource = {
    icon:'',
    componentName:'CcActivity',
    addable: true
}
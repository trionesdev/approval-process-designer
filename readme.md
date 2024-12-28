# 审批流设计器

> 参考钉钉的交互模式，开发的审批流设计器，支持自定义扩展


![img.png](images/img.png)

## 功能
- 支持 发起，审批，抄送，条件分支 节点类型
- 支持自定义节点类型
- 支持扩展节点属性

## 使用
1. 安装
```shell
    pnpm add @trionesdev/approval-process-designer-react
```
2. 页面使用
```typescript
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
```
参考范例：[examples/approval-process-designer-react](examples/approval-process-designer-react)

#### 互相吹捧，共同进步
<div style="width: 100%;text-align: center">
<img src="images/shuque_wx.jpg" width="200px" alt="">
</div>
import styled from "@emotion/styled";
import React, {createRef, FC, useEffect, useState} from "react";
import classNames from "classnames";
import {AddActivityBox} from "./AddActivityBox";
import {BranchBox} from "./BranchBox";
import {CloseIcon, QuestionIcon} from "../Icons";
import {Tooltip} from "../components";
import {IconWidget} from "../widget/IconWidget";
import {IActivity} from "../types";

const ConditionActivityStyled = styled('div')({
    boxSizing: 'border-box',
    minHeight: '220px',
    display: 'inline-flex',
    flexDirection: 'column',
    '.condition-activity-wrapper': {
        marginTop: '30px',
        paddingRight: '50px',
        paddingLeft: '50px',
        display: 'inline-flex',
        alignItems: 'center',
        flexDirection: 'column',
        flexGrow: 1,
        position: 'relative',
        '&::before': {
            content: '" "',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            margin: 'auto',
            width: '2px',
            height: '100%',
            backgroundColor: `#CACACA`
        },
        '.condition-activity-box': {
            boxSizing: 'border-box',
            position: 'relative',
            width: '220px',
            minHeight: '72px',
            background: '#FFFFFF',
            borderRadius: '4px',
            padding: '14px 19px',
            cursor: 'pointer',
            '&::after': {
                pointerEvents: 'none',
                content: '" "',
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 2,
                borderRadius: '4px',
                border: '1px solid transparent',
                transition: 'all 0.1s cubic-bezier(0.645, 0.045, 0.355, 1)',
                boxShadow: ' 0 2px 5px 0 rgba(0, 0, 0, 0.1)'
            },
            '&:hover': {
                '.editable-title': {
                    borderBottom: 'dashed 1px #FFFFFF',
                    borderColor: '#15BC83'
                },
                '.priority-title': {
                    display: 'none!important',
                },
                '.close': {
                    display: 'inline-flex!important'
                }
            },
            '.header': {
                display: 'flex',
                width: '1005',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'relative',
                fontSize: '12px',
                color: '#15BC83',
                textAlign: 'left',
                lineHeight: '16px',
                'input': {
                    outline: 'none'
                },
                '.default-title': {
                    color: 'rgba(25, 31, 37, 0.56)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                },
                '.editable-title': {
                    lineHeight: '15px',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    // borderBottom: 'dashed 1px transparent'
                },
                '.priority-title': {
                    display: 'inline-block',
                    float: 'right',
                    marginRight: '10px',
                    color: 'rgba(25, 31, 37, 0.56)'
                },
                '.close': {
                    display: 'none',
                    width: '14px',
                    height: '14px',
                    position: 'absolute',
                    right: '-2px',
                    top: '-2px',
                    fontSize: '14px',
                    textAlign: 'center',
                    lineHeight: '20px',
                    zIndex: 2,
                    color: 'rgba(25, 31, 37, 0.56)'
                }
            },
            '.body': {
                position: 'relative',
                fontSize: '14px',
                // padding: '16px',
                // paddingRight: '30px',
                display: 'flex',
                marginTop: '6px',
                justifyContent: 'space-between',
                '.description': {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box'
                }
            }
        }
    }
})

type ConditionActivityProps = IActivity

export const ConditionActivity: FC<ConditionActivityProps> = ({
                                                                  processNode,
                                                                  nextActivity,
                                                                  onClick
                                                              }) => {
    const inputRef = createRef<any>()
    const [editing, setEditing] = useState(false)

    const handleOnClick = (e: any) => {
        if (processNode?.defaultCondition) {
            return
        }
        onClick?.(processNode)
    }

    const handleInputBlur = (e: any) => {
        setEditing(false)
    }

    const handleRemove = () => {
        processNode.remove()
    }

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }, [inputRef])


    return <BranchBox firstCol={processNode.isFirst()} lastCol={processNode.isLast()}>
        <ConditionActivityStyled className={`condition-activity`}>
            <div className={`condition-activity-wrapper`}>
                <div className={classNames('condition-activity-box')} onClick={handleOnClick}>
                    <div className={classNames(`header`)} >
                        {
                            processNode?.defaultCondition ?
                                <>
                                <span className={classNames('default-title')}>默认条件
                                    <Tooltip placement={`top`} showArrow={true} trigger={`hover`}
                                             title={`当未满足其他条件时，系统自动创建默认条件，确保条件分支完整`}>
                                        <span
                                            className={classNames('action-icon')}>{React.cloneElement(QuestionIcon)}</span>
                                    </Tooltip>
                                </span>
                                    <span
                                        className={classNames('priority-title')}>优先级{(processNode.index || 0) + 1}</span>
                                </> :
                                <>{
                                    editing ? <input ref={inputRef}
                                                     defaultValue={processNode?.title || `条件${(processNode.index || 0) + 1}`}
                                                     onBlur={handleInputBlur}/> : <>
                                        <span className={classNames('editable-title')}
                                              onClick={() => setEditing(true)}>{processNode?.title || `条件${(processNode.index || 0) + 1}`}</span>
                                        <span
                                            className={classNames('priority-title')}>优先级{(processNode.index || 0) + 1}</span>
                                        <IconWidget className={`close`} icon={React.cloneElement(CloseIcon)}
                                                    onClick={handleRemove}/>
                                    </>
                                }</>
                        }
                    </div>
                    <div className={classNames(`body`)}>
                        <div
                            className={classNames(`description`)}>{processNode?.props?.defaultCondition ? '其他条件进入此流程' : (processNode.description || '请设置条件')}</div>
                    </div>
                </div>
                <AddActivityBox processNode={processNode}/>
            </div>
            {nextActivity}
        </ConditionActivityStyled>
    </BranchBox>
}
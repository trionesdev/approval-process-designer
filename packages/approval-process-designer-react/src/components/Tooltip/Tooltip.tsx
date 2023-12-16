import React, {FC} from "react"
import RcTooltip from "rc-tooltip"
import styled from "@emotion/styled";
import {css, Global} from "@emotion/react";
import {TooltipProps as RcTooltipProps} from "rc-tooltip/es/Tooltip";

const prefixCls = 'td-tooltip'
const tooltipCss = css({
    [`.${prefixCls}`]: {
        position: 'absolute',
        zIndex: 1070,
        display: 'block',
        visibility: 'visible',
        lineHeight: 1.5,
        fontSize: '12px',
        backgroundColor: '#0000000d',
        padding: '0px',
        opacity: .9,
        width: 'max-content',
        maxWidth: '250px',
        color: 'rgba(0,0,0,0.88)',
        [`&-hidden`]: {
            display: 'none'
        },
        [`&-arrow`]: {
            transform: ' translateX(-50%) translateY(100%) rotate(180deg)',
            zIndex: 1,
            width: '16px',
            height: '16px',
            display: 'block',
            overflow: 'hidden',
            '&::before': {
                position: 'absolute',
                bottom: 0,
                insetInlineStart: 0,
                content: '" "',
                width: '16px',
                height: '8px',
                backgroundColor: 'rgba(0,0,0,0.85)',
                clipPath: 'path(\'M 0 8 A 4 4 0 0 0 2.82842712474619 6.82842712474619 L 6.585786437626905 3.0710678118654755 A 2 2 0 0 1 9.414213562373096 3.0710678118654755 L 13.17157287525381 6.82842712474619 A 4 4 0 0 0 16 8 Z\')',
                pointerEvents: 'none'
            },
            '&::after': {
                position: 'absolute',
                content: '" "',
                width: '8.970562748477143px',
                height: '8.970562748477143px',
                bottom: 0,
                insetInline: 0,
                margin: 0,
                borderRadius: '0 0 2px 0',
                transform: 'translateY(50%) rotate(-135deg)',
                background: 'transparent',
                boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.05)'
            }
        },
        [`$-content`]: {
            position: 'relative',
            margin:0,
            padding:0
        },
        [`&-inner`]: {
            textAlign: 'start',
            textDecoration: 'none',
            wordWrap: 'break-word',
            backgroundColor: 'rgba(0,0,0,0.85)',
            color: '#ffffff',
            padding: '6px 8px',
            minWidth: '32px',
            minHeight: '32px',
            borderRadius: '6px',
            boxSizing: 'border-box'
        },
    }
})

const TooltipStyled = styled(RcTooltip)((props) => {
    return {}
})

type TooltipProps = {
    title?: React.ReactNode
} & Omit<RcTooltipProps, 'overlay' | 'prefixCls'>

export const Tooltip: FC<TooltipProps> = ({
                                              children,
                                              title,
                                              ...props
                                          }) => {
    return <>
        <Global styles={tooltipCss}/>
        <TooltipStyled prefixCls={prefixCls} overlay={title}  {...props}>
            {children}
        </TooltipStyled>
    </>
}
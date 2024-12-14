import React, {FC} from "react";
import styled from "@emotion/styled";
import classnames from "classnames"

type Span = 0 | 2 | 3 | 4 | 6 | 8 | 12


const ColStyled = styled('div')((props) => {

    return {
        flex: `0 0 ${props.style.width}`,
        maxWidth: `${props.style.width}`,
        boxSizing: 'border-box',
    }
})

type ColProps = {
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    span?: Span;
}

export const Col: FC<ColProps> = ({
                                      children,
                                      className,
                                      style,
                                      span
                                  }) => {
    const width = span ? `${100 / (24 / span)}%` : '100%'
    return <ColStyled className={classnames(className, `td-col`, `td-col-${span}`)} style={{...style, width}} >
        <div>{children}</div>
    </ColStyled>
}
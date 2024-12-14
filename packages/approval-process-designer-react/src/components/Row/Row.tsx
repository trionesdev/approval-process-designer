import React, {forwardRef} from "react";
import styled from "@emotion/styled";
import _ from "lodash";

const RowStyled = styled.div`
    display: flex;
    flex-flow: row wrap;
    min-width: 0;
`

type RowProps = {
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    gutter?: number | number[]
}

export const Row = forwardRef(({
                                   children,
                                   className,
                                   style,
                                   gutter
                               }: RowProps, ref: any) => {
    let rowGap: number = 0;
    let columnGap: number = 0;
    let margin: number = 0;
    if (_.isArray(gutter)) {
        columnGap = gutter[0] / 2
        rowGap = gutter[1]
        margin = 0 - gutter[0] / 2
    } else if (typeof gutter === "number") {
        columnGap = gutter / 2
        rowGap = gutter
        margin = 0 - gutter / 2
    }

    const handleRender = (children: React.ReactNode) => {
        const childArray = React.Children.toArray(children);
        return childArray.map((child: React.ReactNode) => {
            if (React.isValidElement(child)) {
                return React.cloneElement(child, _.merge({}, child.props, {
                    style: {
                        background: "white",
                        ...child.props.style,
                        paddingLeft: columnGap, paddingRight: columnGap
                    }, ...child.props
                }))
            }
        })
    }

    return <RowStyled ref={ref} className={className} style={{
        rowGap,
        marginLeft: margin,
        marginRight: margin, ...style
    }}>{handleRender(children)}</RowStyled>
})
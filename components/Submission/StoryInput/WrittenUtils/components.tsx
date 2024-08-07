// @ts-nocheck
import React, { Ref, PropsWithChildren } from 'react'
import ReactDOM from 'react-dom'
import { cx, css } from '@emotion/css'
import colors from '../../../../config/colors'

interface BaseProps {
	className: string
	[key: string]: unknown
}
type OrNull<T> = T | null

const Button = React.forwardRef(
	(
		{
			className,
			active,
			reversed,
			...props
		}: PropsWithChildren<
			{
				active: boolean
				reversed: boolean
			} & BaseProps
		>,
		ref: Ref<OrNull<HTMLSpanElement>>
		// @ts-nocheck
	) => (
		<span
			{...props} // @ts-ignore
			ref={ref}
			className={cx(
				className,
				css`
					cursor: pointer;
					border: 1px solid ${active ? colors.orange : colors.white};
					color: ${reversed
						? active
							? 'white'
							: '#aaa'
						: active
						? colors.orange
						: '#ccc'};
				`
			)}
		/>
	)
)

const EditorValue = React.forwardRef(
	(
		{
			className,
			value,
			...props
		}: PropsWithChildren<
			{
				value: any
			} & BaseProps
		>,
		ref: Ref<OrNull<null>>
	) => {
		const textLines = value.document.nodes // @ts-ignore
			.map((node) => node.text)
			.toArray()
			.join('\n')
		return (
			<div // @ts-ignore
				ref={ref}
				{...props}
				className={cx(
					className,
					css`
						margin: 30px -20px 0;
					`
				)}
			>
				<div
					className={css`
						font-size: 14px;
						padding: 5px 20px;
						color: #404040;
						border-top: 2px solid #eeeeee;
						background: #f8f8f8;
					`}
				>
					Slate{"'"}s value as text
				</div>
				<div
					className={css`
						color: #404040;
						font: 12px monospace;
						white-space: pre-wrap;
						padding: 10px 20px;
						div {
							margin: 0 0 0.5em;
						}
					`}
				>
					{textLines}
				</div>
			</div>
		)
	}
)

const Icon = React.forwardRef(
	(
		{ className, ...props }: PropsWithChildren<BaseProps>,
		ref: Ref<OrNull<HTMLSpanElement>>
	) => (
		<span
			{...props} // @ts-ignore
			ref={ref}
			className={cx(
				'material-icons',
				className,
				css`
					font-size: 18px;
					vertical-align: text-bottom;
				`
			)}
		/>
	)
)

const Instruction = React.forwardRef(
	(
		{ className, ...props }: PropsWithChildren<BaseProps>,
		ref: Ref<OrNull<HTMLDivElement>>
	) => (
		<div
			{...props} // @ts-ignore
			ref={ref}
			className={cx(
				className,
				css`
					white-space: pre-wrap;
					margin: 0 -20px 10px;
					padding: 10px 20px;
					font-size: 14px;
					background: #f8f8e8;
				`
			)}
		/>
	)
)

const Menu = React.forwardRef(
	(
		{ className, ...props }: PropsWithChildren<BaseProps>,
		ref: Ref<OrNull<HTMLDivElement>>
	) => (
		<div
			{...props} // @ts-ignore
			ref={ref}
			className={cx(
				className,
				css`
					& > * {
						display: inline-block;
					}
					& > * + * {
						margin-left: 15px;
					}
				`
			)}
		/>
	)
)

const Portal = ({ children }) => {
	return typeof document === 'object'
		? ReactDOM.createPortal(children, document.body)
		: null
}

const Toolbar = React.forwardRef(
	(
		{ className, ...props }: PropsWithChildren<BaseProps>,
		ref: Ref<OrNull<HTMLDivElement>>
	) => (
		<Menu
			{...props}
			ref={ref}
			className={cx(
				className,
				css`
					position: relative;
					padding: 1px 18px 17px;
					margin: 0 -20px;
					border-bottom: 2px solid #eee;
					margin-bottom: 20px;
				`
			)}
		/>
	)
)

Toolbar.displayName = 'Toolbar'
Menu.displayName = 'Menu'
Portal.displayName = 'Portal'
Button.displayName = 'Button'
EditorValue.displayName = 'EditorValue'
Icon.displayName = 'Icon'
Instruction.displayName = 'Instruction'

export { Toolbar, Icon, Button, EditorValue, Instruction, Menu }

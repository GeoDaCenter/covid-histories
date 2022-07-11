import {
	createContext,
	useState,
	useRef,
	useEffect,
	useContext,
	ReactNode
} from 'react'
import * as tf from '@tensorflow/tfjs'
import * as nsfwjs from 'nsfwjs'
tf.enableProdMode()

const initModel = async () => {
	const model = await nsfwjs.load() //`https://github.com/infinitered/nsfwjs/raw/master/example/nsfw_demo/public/model/`
	return model
}

export const NsfwContext = createContext({})

export const NsfwProvider: React.FC<{ children: ReactNode }> = ({
	children
}) => {
	const [nsfwReady, setNsfwReady] = useState<boolean>(false)
	const nsfw = useRef<nsfwjs.NSFWJS | null>(null)

	useEffect(() => {
		const init = async () => {
			initModel().then((model) => {
				nsfw.current = model
				setNsfwReady(true)
			})
		}
		if (!nsfwReady) init()
	}, [])

	return (
		<NsfwContext.Provider value={{ nsfw: nsfw.current, nsfwReady }}>
			{children}
		</NsfwContext.Provider>
	)
}

/** Update the viewport from anywhere */
export const useNsfw = () => {
	const ctx = useContext(NsfwContext)
	if (!ctx) throw Error('Not wrapped in <NsfwProvider />.')
	return ctx
}

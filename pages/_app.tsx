import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { UserProvider } from '@auth0/nextjs-auth0'
import { ThemeProvider } from '@mui/material'
import { TopBar } from '../components/TopBar'
import { Footer } from '../components/Footer'
import { createTheme } from '@mui/material/styles'
import colors from '../config/colors'

const theme = createTheme({
	palette: {
		mode: 'dark',
		primary: {
			main: colors.yellow
		},
		background: {
			default: colors.darkgray
		},
		text: {
			primary: colors.white
		},
		secondary: {
			main: '#f50057'
		}
	},
	typography: {
		h1: {
			fontWeight: 'bold'
		},
		h2: {
			fontWeight: 'bold'
		},
		h3: {
			fontWeight: 'bold'
		},
		h4: {
			fontWeight: 'bold'
		}
	},
	components: {
		MuiButton: {
			defaultProps: {
				sx: {
					textTransform: 'none'
				}
			}
		}
	}
})

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<UserProvider>
			<ThemeProvider theme={theme}>
				<TopBar />
				<Component {...pageProps} />
				<Footer />
			</ThemeProvider>
		</UserProvider>
	)
}

export default MyApp

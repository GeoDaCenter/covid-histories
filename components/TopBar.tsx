// @ts-nocheck
import { useUser } from '@auth0/nextjs-auth0'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import React, { useState, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import colors from '../config/colors'
import {
  Button,
  Popover,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import Image from 'next/image'

const NavBarOuterContainer = styled.div`
  width: 100%;
  background: ${colors.skyblue};
  @media (max-width: 1024px) {
    position: sticky;
    top: 0;
    z-index: 1;
  }
`
const NavbarContainer = styled.nav`
  width: 100%;
  display: flex;
  margin: 0 auto;
  color: ${colors.darkgray};
  ul {
    padding-inline-start: 0;
  }

  button.close-mobile {
    display: ${(props) => (props.navOpen ? 'block' : 'none')};
    background: none;
    border: none;
    position: fixed;
    top: 1em;
    right: 1em;
    color: white;
    z-index: 5;
    font-size: 2rem;
    @media (min-width: 1024px) {
      display: none;
    }
  }
  .mobile {
    display: none;
  }

  @media (max-width: 1024px) {
    .desktop {
      display: none;
    }
    .mobile {
      display: initial;
    }
  }
`

const NavLogo = styled.div`
  align-items: center;
  font-size: 1.25em;
  flex-grow: 1;
  width: 100%;
  display: flex;
  /* justify-content: center; */
  align-items: center;
  padding-left: 1em;
`

const NavItems = styled.div`
  font-size: 1.25em;
  flex-grow: 0;
  z-index: 1;
  ul {
    list-style: none;
    margin: 0;
    order: 1;
    @media (min-width: 1025px) {
      display: flex;
      margin: '0 0 0 auto';
    }
    li {
      @media (min-width: 1024px) {
        height: 50px;
        display: flex;
      }
      align-items: center;
      box-sizing: border-box;
    }
  }
  a,
  button {
    margin: auto;
    display: flex;
    align-items: center;
    flex: 1;
    text-align: center;
    padding: 10px;
    text-decoration: none;
    transition: 250ms all;
    border: none;
    font-family: Lato, sans-serif;
    font-size: 0.9rem;
    line-height: 1;
    letter-spacing: 1.75px;
    font-weight: 400;
    font-stretch: normal;
    cursor: pointer;
    &:hover {
      background: ${colors.teal}55;
      color: ${colors.teal};
    }
    &.active {
      background: ${colors.teal};
      color: #eee;
    }
  }
  ul.drop-down-nav li {
    display: none;
  }
  @media (max-width: 1024px) {
    /* @ts-ignore */
    display: ${(props) => (props.navOpen ? 'flex' : 'none')};
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.85);
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: white;
    ul li a {
      font-size: 2rem;
    }
  }
`

const NavHamburger = styled(Button)`
  margin: 0 0 0 auto !important;
  max-height: 50px;
  max-width: 50px;
  padding: 0.125em !important;
  pointer-events: all;
  overflow: hidden;
  background: none;
  border: none;
  &::after {
    display: none;
  }
  @media (min-width: 1025px) {
    display: none;
  }
  img {
    width: 100%;
    height: 100%;
  }
`

const DropDownNav = styled.ul`
  list-style: none;
  margin-left: 0;
  padding: 0 1em;
  li {
    text-decoration: underline;
    padding: 0.25em;
  }
`

const GoogleTranslateDiv = styled.div`
  font-size: 0.75rem;
  margin: 0.5em 0.5em;
  background: rgb(245, 245, 245);
  border-radius: 0.25em;
  padding: 0.25rem 0.5rem 0 0.5rem;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  a {
    font-size: 0.75rem;
  }
`

export const TopBar: React.FC = () => {
  const { pathname } = useRouter()
  const { user } = useUser()

  const theme = useTheme()
  const md = useMediaQuery(theme.breakpoints.up('md'))

  const [navOpen, setNavOpen] = useState<boolean>(false)
  const [translateOpen, setTranslateOpen] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const toggleNavOpen = () => setNavOpen((prev) => !prev)

  const invokeGoogleTranslate = () => {
    try {
      new window.google.translate.TranslateElement(
        { pageLanguage: 'en' },
        'google_translate_element'
      )
      setTranslateOpen(true)
    } catch {
      console.log('Google translate failed to load')
    }
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  return (
    <NavBarOuterContainer>
      {/* @ts-ignore */}
      <NavbarContainer navOpen={navOpen} className="standard-page-width">
        <NavLogo>
          <Link href="/">
            <a>
              <Typography fontSize="1.5rem">
                Atlas <span className="cursive">Stories</span>
              </Typography>
            </a>
          </Link>
        </NavLogo>
        {/* @ts-ignore */}
        <NavItems navOpen={navOpen}>
          <ul>
            <li>
              <Link href="/submit">
                <a>SUBMIT</a>
              </Link>
            </li>
            <li>
              <Link href="/about">
                <a>ABOUT</a>
              </Link>
            </li>
            <li style={{ marginRight: '.25em' }}>
              <Link href="/privacy">
                <a>PRIVACY</a>
              </Link>
            </li>
            {user ? (
              <>
                <li className="desktop">
                  <Button
                    aria-describedby={id}
                    variant="contained"
                    onClick={handleClick}
                    sx={{
                      whiteSpace: 'nowrap',
                      padding: '0.5em',
                      marginLeft: '0.5em',
                      background: colors.orange
                    }}
                  >
                    {user.name}{' '}
                    <img
                      src="/down-arrow.svg"
                      width="10px"
                      height="10px"
                      style={{ margin: '0 2px' }}
                      alt=""
                    />
                  </Button>
                  <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left'
                    }}
                    usePortal={false}
                  >
                    <DropDownNav>
                      <li>
                        <Link href="/my-stories">
                          <a>My Stories</a>
                        </Link>
                      </li>
                      <li>
                        <Link href="/resources">
                          <a>Resources</a>
                        </Link>
                      </li>
                      <li>
                        <Link href="/api/auth/logout">
                          <a>Logout</a>
                        </Link>
                      </li>
                    </DropDownNav>
                  </Popover>
                </li>
                <span className="mobile">
                  <hr />
                  <li>
                    <Link href="/my-stories">
                      <a>My Stories</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/resources">
                      <a>Resources</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/api/auth/logout">
                      <a>Logout</a>
                    </Link>
                  </li>
                </span>
              </>
            ) : (
              <li>
                <Link href={`/api/auth/login?redirect=${pathname}`}>
                  <a>LOGIN</a>
                </Link>
              </li>
            )}
            <li style={{ alignItems: 'flex-start' }}>
              {!translateOpen && (
                <Button
                  title="Translate this page"
                  onClick={invokeGoogleTranslate}
                  sx={{ color: 'black', whiteSpace: 'nowrap' }}
                >
                  <Image
                    src="/translate.svg"
                    alt="Translate this page"
                    width="20px"
                    height="20px"
                  />
                </Button>
              )}
              <GoogleTranslateDiv
                style={{ visibility: translateOpen ? 'visible' : 'hidden' }}
                id="google_translate_element"
              ></GoogleTranslateDiv>
            </li>
          </ul>
        </NavItems>
        <NavHamburger onClick={toggleNavOpen} className="mobile">
          <img src="/menu.svg" alt="" />
        </NavHamburger>
        <button className="close-mobile" onClick={toggleNavOpen}>
          &times;
        </button>
      </NavbarContainer>
    </NavBarOuterContainer>
  )
}

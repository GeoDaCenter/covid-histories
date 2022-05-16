// @ts-nocheck
import { useUser } from "@auth0/nextjs-auth0";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import colors from "../config/colors";
import { Button, Popover, Typography } from "@mui/material";
import { signOut } from "next-auth/react"
import { useRouter } from "next/router";

const NavBarOuterContainer = styled.div`
  width: 100%;
  background: ${colors.skyblue};
`;
const NavbarContainer = styled.nav`
  width: 100%;
  max-width: 1140px;
  display: flex;
  margin: 0 auto;
  color: ${colors.darkgray};

  button.close-mobile {
    display: ${(props) => (props.navOpen ? "block" : "none")};
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
`;

const NavLogo = styled.div`
  align-items: center;
  font-size: 1.25em;
  flex-grow: 1;
  width: 100%;
  display: flex;
  /* justify-content: center; */
  align-items: center;
`;

const NavItems = styled.div`
  font-size: 1.25em;
  flex-grow: 0;
  ul {
    list-style: none;
    margin: 0;
    order: 1;
    @media (min-width: 1025px) {
      display: flex;
      margin: "0 0 0 auto";
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
    display: ${(props) => (props.navOpen ? "flex" : "none")};
    position: fixed;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.85);
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: white;
    ul li a {
      font-size: 2rem;
    }
  }
`;

const NavHamburger = styled.button`
  margin: 0 0 0 auto !important;
  max-height: 50px;
  max-width: 50px;
  padding: 0.125em !important;
  pointer-events: all;
  overflow: hidden;
  &::after {
    display: none;
  }
  @media (min-width: 1025px) {
    display: none;
  }
`;

const DropDownNav = styled.ul`
  list-style: none;
  margin-left:0;
  padding:0 1em;
  li {
    text-decoration:underline;  
    padding: 0.25em;
  }
`

export const TopBar: React.FC = () => {
  const {pathname} = useRouter();
  const pathName = ''
  const [navOpen, setNavOpen] = useState(false);
  const toggleNavOpen = () => setNavOpen((prev) => !prev);
  const { user } = useUser();

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <NavBarOuterContainer>
      {/* @ts-ignore */}
      <NavbarContainer navOpen={navOpen}>
        <NavLogo>
          <Link href="/">
            <a>
              <Typography fontSize="1.5rem">
              Atlas <span className="cursive">Stories</span>
              </Typography>
            </a></Link>
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
            <li style={{marginRight:'.25em'}}> 
              <Link href="/privacy">
                <a>PRIVACY</a>
              </Link>
            </li>
            {user ? (
              <>
                <li><Button aria-describedby={id} variant="contained" onClick={handleClick} sx={{ whiteSpace: "nowrap", padding: '0.5em', marginLeft:'0.5em', background: colors.orange }}>
                  {user.name}
                </Button>
                  <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
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
                        <Link href="/help">
                          <a>Help</a>
                        </Link>
                      </li>
                      <li>
                        <Link href="/api/auth/logout">
                          <a>Logout</a>
                        </Link>
                      </li>
                    </DropDownNav>
                  </Popover></li>

              </>
            ) : (
              <li><Link href={`/api/auth/login?redirect=${pathname}`}><a>LOGIN</a></Link></li>
            )}
          </ul>
        </NavItems>
        <NavHamburger onClick={toggleNavOpen}>
          {navOpen ? "Close" : "Open"}
        </NavHamburger>
        <button className="close-mobile" onClick={toggleNavOpen}>
          ×
        </button>
      </NavbarContainer>
    </NavBarOuterContainer>
  );
};

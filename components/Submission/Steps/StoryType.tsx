import { Button, Grid } from "@mui/material";
import styled from "styled-components";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { SubmissionTypes } from "../../../stores/submission/submissionSlice";
import { selectType, setTheme, setType } from "../../../stores/submission";
import { StepComponentProps } from "./types";
import colors from "../../../config/colors";

interface StoryOption {
  type: SubmissionTypes;
  label: string;
  icon: string;
}

const icons: { [key: string]: any } = {
  'av': <svg width="181" height="115" viewBox="0 0 181 115" xmlns="http://www.w3.org/2000/svg">
    <path d="M75.0382 45.8586L56.532 36.1412V26.3579L75.0382 16.6461V45.8586Z" />
    <path d="M9.78509 96.5779H2.62756L27.5562 48.1002L50.7213 96.5779L43.712 96.6493L27.3362 62.3551L9.78509 96.5779Z" />
    <path d="M20.6726 10.8402H1.94702V0.881165H28.1103L20.6726 10.8402Z" />
    <path d="M4.07773 67.3532L0.633545 62.8103L18.777 49.0389L22.2212 53.5818L4.07773 67.3532Z" />
    <path d="M140.226 33.0871C140.226 45.2489 130.372 55.109 118.21 55.109C106.049 55.109 96.1938 45.2488 96.1938 33.0871C96.1938 20.9308 106.049 11.0709 118.21 11.0709C130.372 11.0709 140.226 20.9311 140.226 33.0871Z" />
    <path d="M47.4898 16.3387H6.85622C4.14806 16.3387 1.94531 18.5305 1.94531 21.2441V41.255C1.94531 43.9742 4.14806 46.1714 6.85622 46.1714H47.4898C50.198 46.1714 52.4007 43.9742 52.4007 41.255V21.2441C52.4007 18.5305 50.198 16.3387 47.4898 16.3387ZM45.6661 30.0057H27.8517V24.6389H45.6661V30.0057Z" />
    <path d="M180.605 114.862C179.43 111.055 170.959 82.919 153.563 64.1329C148.229 58.3705 134.832 52.4654 125.41 61.0787C110.37 74.8115 109.244 104.727 109.161 109.165H71.06L83.3482 82.2385C83.8041 82.3099 84.2546 82.3813 84.7325 82.3813C90.1212 82.3813 94.4883 78.0087 94.4883 72.6255C94.4883 67.2312 90.1158 62.8586 84.7325 62.8586C79.3492 62.8586 74.9766 67.2312 74.9766 72.6255C74.9766 75.4818 76.2346 78.0308 78.1957 79.8215L62.1996 114.862L180.604 114.868L180.605 114.862Z" />
  </svg>,
  'written': <svg width="123" height="123" viewBox="0 0 123 123" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M90.2521 67.9703L114.042 43.9973C114.348 44.4426 114.522 44.9817 114.522 45.5325C114.522 46.2395 114.239 46.9192 113.747 47.4192L96.3225 64.9812C95.8225 65.4773 95.5473 66.157 95.5473 66.864V72.1999C95.5473 73.6687 96.7333 74.864 98.1906 74.864C99.6518 74.864 100.838 73.6687 100.838 72.1999V67.9694L117.488 51.1884C118.976 49.6884 119.813 47.6532 119.813 45.5322C119.813 43.5634 119.092 41.6689 117.802 40.208L120.135 37.8564C121.623 36.3564 122.46 34.3212 122.46 32.2002C122.46 30.0752 121.619 28.04 120.135 26.544C119.127 25.5284 118.042 24.4307 117.034 23.419C115.546 21.919 113.527 21.0752 111.422 21.0752C109.314 21.0752 107.295 21.919 105.81 23.419L90.2528 39.095V8.20001C90.2528 3.77811 86.7027 0.200012 82.3153 0.200012H8.23462C3.84727 0.200012 0.297119 3.77811 0.297119 8.20001V114.86C0.297119 119.282 3.84727 122.86 8.23462 122.86H82.3153C86.7027 122.86 90.2528 119.282 90.2528 114.86L90.2521 67.9703ZM84.9618 44.4273V8.20031C84.9618 6.72761 83.7758 5.53231 82.3146 5.53231H8.23394C6.77275 5.53231 5.58679 6.72761 5.58679 8.20031V114.86C5.58679 116.333 6.77275 117.528 8.23394 117.528H82.3146C83.7758 117.528 84.9618 116.333 84.9618 114.86V73.2983L58.6103 99.8573C57.7421 100.736 56.6763 101.4 55.5097 101.791C51.8239 103.029 40.8164 106.728 40.8164 106.728C39.8668 107.045 38.8204 106.795 38.1111 106.08C37.4018 105.365 37.1577 104.31 37.4716 103.353C37.4716 103.353 41.1419 92.2594 42.3667 88.5484C42.7581 87.3687 43.4131 86.2984 44.2851 85.4195L84.9618 44.4273ZM18.8146 106.865H29.3993C30.8605 106.865 32.0464 105.67 32.0464 104.201C32.0464 102.729 30.8605 101.533 29.3993 101.533H18.8146C17.3573 101.533 16.1713 102.729 16.1713 104.201C16.1713 105.67 17.3573 106.865 18.8146 106.865ZM44.166 99.9825L50.9602 97.7013L46.4295 93.1349L44.166 99.9825ZM49.0145 88.2015L55.859 95.096L99.7405 50.866L92.8999 43.9715L49.0145 88.2015ZM18.8143 74.8655H45.274C46.7352 74.8655 47.9212 73.6702 47.9212 72.2014C47.9212 70.7287 46.7352 69.5334 45.274 69.5334H18.8143C17.357 69.5334 16.171 70.7287 16.171 72.2014C16.171 73.6702 17.357 74.8655 18.8143 74.8655ZM18.8143 64.2015H55.8587C57.316 64.2015 58.5019 63.0062 58.5019 61.5335C58.5019 60.0608 57.316 58.8655 55.8587 58.8655H18.8143C17.357 58.8655 16.171 60.0608 16.171 61.5335C16.171 63.0062 17.357 64.2015 18.8143 64.2015ZM18.8143 53.5335H66.4393C67.9005 53.5335 69.0865 52.3382 69.0865 50.8655C69.0865 49.3967 67.9005 48.2014 66.4393 48.2014H18.8143C17.357 48.2014 16.171 49.3967 16.171 50.8655C16.171 52.3382 17.357 53.5335 18.8143 53.5335ZM103.484 47.096L96.6391 40.2015L109.549 27.1895C110.046 26.6895 110.72 26.4083 111.421 26.4083C112.123 26.4083 112.797 26.6895 113.29 27.1895L116.39 30.3145C116.886 30.8145 117.165 31.4942 117.165 32.2012C117.165 32.9082 116.886 33.5879 116.39 34.084L103.484 47.096ZM18.8143 42.8655H71.7337C73.191 42.8655 74.3769 41.6702 74.3769 40.2014C74.3769 38.7287 73.191 37.5334 71.7337 37.5334H18.8143C17.357 37.5334 16.171 38.7287 16.171 40.2014C16.171 41.6702 17.357 42.8655 18.8143 42.8655ZM18.8143 32.2015H71.7337C73.191 32.2015 74.3769 31.0062 74.3769 29.5335C74.3769 28.0608 73.191 26.8655 71.7337 26.8655H18.8143C17.357 26.8655 16.171 28.0608 16.171 29.5335C16.171 31.0062 17.357 32.2015 18.8143 32.2015ZM45.274 21.5335H71.7337C73.191 21.5335 74.3769 20.3382 74.3769 18.8655C74.3769 17.3967 73.191 16.2014 71.7337 16.2014H45.274C43.8128 16.2014 42.6268 17.3967 42.6268 18.8655C42.6268 20.3382 43.8128 21.5335 45.274 21.5335Z" />
  </svg>,
  'photo': <svg width="129" height="129" viewBox="0 0 129 129" xmlns="http://www.w3.org/2000/svg">
    <path d="M77.2898 72.9461H52.2898C46.0789 72.9539 41.0478 77.9852 41.0398 84.1961V96.6961C41.0398 97.0281 41.1726 97.3445 41.407 97.5789C41.6414 97.8133 41.9578 97.9461 42.2898 97.9461H87.2898C87.6218 97.9461 87.9382 97.8133 88.1726 97.5789C88.407 97.3445 88.5398 97.0281 88.5398 96.6961V84.1961C88.532 77.9852 83.5007 72.9541 77.2898 72.9461Z" />
    <path d="M115.04 0.196106H14.5398C6.95 0.203918 0.797795 6.35631 0.789795 13.9461V114.446C0.797607 122.036 6.95 128.188 14.5398 128.196H115.04C122.63 128.188 128.782 122.036 128.79 114.446V13.9461C128.782 6.35631 122.63 0.204106 115.04 0.196106ZM64.7898 22.9461C69.7625 22.9461 74.532 24.9227 78.0478 28.4383C81.5634 31.9539 83.54 36.7235 83.54 41.6963C83.54 46.6691 81.5634 51.4385 78.0478 54.9543C74.5322 58.4699 69.7626 60.4465 64.7898 60.4465C59.817 60.4465 55.0476 58.4699 51.5318 54.9543C48.0162 51.4387 46.0396 46.6691 46.0396 41.6963C46.0435 36.7236 48.024 31.958 51.5357 28.4423C55.0513 24.9306 59.8169 22.9501 64.7897 22.9462L64.7898 22.9461ZM29.5398 113.196H22.0398C18.5867 113.196 15.7898 110.399 15.7898 106.946V99.4461C15.7898 97.3758 17.4695 95.6961 19.5398 95.6961C21.6101 95.6961 23.2898 97.3758 23.2898 99.4461V105.696H29.5398C31.6101 105.696 33.2898 107.376 33.2898 109.446C33.2898 111.516 31.6101 113.196 29.5398 113.196ZM29.5398 22.6961H23.2898V28.9461C23.2898 31.0164 21.6101 32.6961 19.5398 32.6961C17.4695 32.6961 15.7898 31.0164 15.7898 28.9461V21.4461C15.7898 17.993 18.5867 15.1961 22.0398 15.1961H29.5398C31.6101 15.1961 33.2898 16.8758 33.2898 18.9461C33.2898 21.0164 31.6101 22.6961 29.5398 22.6961ZM96.0398 96.6961C96.0398 101.528 92.1218 105.446 87.2898 105.446H42.2898C37.4578 105.446 33.5398 101.528 33.5398 96.6961V84.1961C33.5437 79.2234 35.5242 74.4578 39.0359 70.9421C42.5515 67.4304 47.3171 65.4499 52.2899 65.446H77.2899C82.2626 65.4499 87.0282 67.4304 90.5439 70.9421C94.0556 74.4577 96.0361 79.2233 96.04 84.1961L96.0398 96.6961ZM113.79 106.946C113.79 110.399 110.993 113.196 107.54 113.196H100.04C97.9695 113.196 96.2898 111.516 96.2898 109.446C96.2898 107.376 97.9695 105.696 100.04 105.696H106.29V99.4461C106.29 97.3758 107.969 95.6961 110.04 95.6961C112.11 95.6961 113.79 97.3758 113.79 99.4461V106.946ZM113.79 28.9461C113.79 31.0164 112.11 32.6961 110.04 32.6961C107.969 32.6961 106.29 31.0164 106.29 28.9461V22.6961H100.04C97.9695 22.6961 96.2898 21.0164 96.2898 18.9461C96.2898 16.8758 97.9695 15.1961 100.04 15.1961H107.54C109.196 15.1961 110.786 15.8563 111.958 17.0281C113.13 18.1999 113.79 19.7898 113.79 21.4461V28.9461Z" />
    <path d="M76.0398 41.6961C76.0398 47.9109 71.0046 52.9461 64.7898 52.9461C58.575 52.9461 53.5398 47.9109 53.5398 41.6961C53.5398 35.4813 58.575 30.4461 64.7898 30.4461C71.0046 30.4461 76.0398 35.4813 76.0398 41.6961Z" />
  </svg>,
  'phone': <svg width="152" height="109" viewBox="0 0 152 109" xmlns="http://www.w3.org/2000/svg">
    <path d="M129.902 108.864C128.921 108.864 127.94 108.864 126.768 108.667C122.258 107.883 118.34 105.335 115.792 101.609L76.7862 45.5571C71.2953 37.7154 73.2571 27.1347 81.0988 21.6436L88.7431 16.1527C92.8583 13.4071 98.3493 14.3882 101.089 18.3059L110.498 31.8299C113.243 35.7478 112.262 41.4361 108.344 44.1756L105.994 45.7427C105.407 46.1375 104.815 46.9211 104.815 47.7045C104.815 48.4881 104.815 49.2716 105.401 49.8578L121.078 72.9935C122.059 74.3632 123.824 74.7579 125.194 73.777L127.544 72.2099C131.462 69.4644 137.15 70.4455 139.89 74.3632L149.496 88.0846C150.866 90.0464 151.458 92.3972 150.866 94.7479C150.471 97.0987 149.101 99.0606 147.139 100.43L139.495 105.921C136.762 107.883 133.43 108.864 129.901 108.864L129.902 108.864ZM81.4885 42.2241L120.494 98.2816C122.258 100.83 124.807 102.397 127.744 102.983C130.687 103.569 133.623 102.786 136.171 101.219L143.816 95.7276C144.402 95.3329 144.994 94.5493 144.994 93.7658C145.191 92.9822 144.994 92.1987 144.408 91.6125L134.802 77.8912C133.821 76.5214 132.056 76.1267 130.687 77.1076L128.336 78.6747C124.418 81.4202 118.73 80.4391 115.99 76.5214L100.116 53.7854C98.7458 51.8236 98.1537 49.4728 98.7458 47.122C99.1406 44.7713 100.51 42.8094 102.472 41.4397L104.823 39.8726C106.193 38.8917 106.588 37.1271 105.607 35.7574L96.1979 22.2334C95.2169 20.8637 93.4523 20.469 92.0826 21.4498L84.4383 26.9407C81.8902 28.7052 80.3231 31.2534 79.7369 34.1903C79.1388 36.7325 79.725 39.6752 81.4894 42.2234L81.4885 42.2241Z" />
    <path d="M116.18 29.4841C115.594 29.4841 115.199 29.2867 114.613 29.0893C113.244 28.3057 112.652 26.5411 113.632 24.9741C114.613 23.2096 114.613 21.0562 113.435 19.4832C112.257 17.7187 110.301 16.935 108.142 17.3299C106.574 17.7247 105.007 16.7437 104.612 14.9791C104.218 13.4121 105.199 11.8448 106.963 11.4501C111.276 10.4691 115.786 12.2336 118.137 15.9601C120.487 19.4891 120.685 24.1905 118.531 27.7196C118.143 28.8979 117.162 29.4841 116.181 29.4841L116.18 29.4841Z" />
    <path d="M126.176 32.6186C125.59 32.6186 125.195 32.4212 124.609 32.2238C123.239 31.4402 122.647 29.6756 123.628 28.1086C126.374 23.4072 126.176 17.3299 123.042 12.8199C119.71 8.11855 114.028 5.76181 108.537 7.13763C106.97 7.5324 105.403 6.55146 105.008 4.78686C104.613 3.21978 105.594 1.65254 107.359 1.25779C115.2 -0.309296 123.431 2.82487 127.94 9.48825C132.45 15.9543 132.642 24.3821 128.724 31.2427C128.138 32.2297 127.157 32.6185 126.176 32.6185L126.176 32.6186Z" />
    <path d="M75.0219 108.667H3.28593C1.71885 108.667 0.343018 107.297 0.343018 105.724V95.3338C0.343018 73.9683 17.7855 56.5258 39.151 56.5258C60.5166 56.5258 77.959 73.9683 77.959 95.3338V105.724C77.959 107.297 76.5893 108.667 75.0221 108.667H75.0219ZM6.22287 102.787H72.0789V95.3399C72.0789 77.115 57.3764 62.4119 39.1509 62.4119C20.9253 62.4119 6.22287 77.1144 6.22287 95.3399V102.787Z" />
    <path d="M39.1509 62.4121C27.9775 62.4121 18.9629 53.3981 18.9629 42.2241C18.9629 31.0507 27.9769 22.0361 39.1509 22.0361C50.3249 22.0361 59.3389 31.0501 59.3389 42.2241C59.3389 53.3974 50.3249 62.4121 39.1509 62.4121ZM39.1509 27.7201C31.3092 27.7201 24.8432 34.1861 24.8432 42.0278C24.8432 49.8694 31.3092 56.3355 39.1509 56.3355C46.9926 56.3355 53.4586 49.8694 53.4586 42.0278C53.4586 34.1861 47.19 27.7201 39.1509 27.7201Z" />
  </svg>
}
const storyTypeOptions: StoryOption[] = [
  {
    type: "av",
    label: "Video or Audio Diary",
    icon: "av",
  },
  {
    type: "written",
    label: "Written Story",
    icon: "written",
  },
  {
    type: "photo",
    label: "Photograph or Image",
    icon: "photo",
  },
  {
    type: "phone",
    label: "Phone-based Story",
    icon: "phone",
  },
];

interface StoryButtonProps {
  active?: boolean
  onClick?: () => void
  children?: React.ReactNode | React.ReactNode[]
}

const StoryButtonEl = styled(Button)<{active: boolean, onClick: Function}>`
    background:none;
    border: 1px solid ${props => props.active ? colors.orange : colors.white} !important;
    border-radius:.5em;
    padding:1em;
    height: 100%;
    width: calc(100% - 2em);
    margin:0 2em;
    color: ${props => props.active ? colors.orange : colors.white} !important;
    display:block !important;
    transition:250ms all;
    svg {
      fill: ${props => props.active ? colors.orange : colors.white};
      transition: 250ms all;
      max-width:50%;
      display: block;
      margin:1.5em auto;
    }
    p {
      display:block;
    }
`

const StoryButton: React.FC<StoryButtonProps> = ({active, onClick, children}) => {
  // @ts-ignore
  return <StoryButtonEl onClick={onClick} active={active}>
    {children}
  </StoryButtonEl>
}

export const StoryType: React.FC<StepComponentProps> = () => {
  const dispatch = useDispatch();
  const handleType = (type: SubmissionTypes) => {
    console.log(type)
    dispatch(setType(type));
  }
  const activeType = useSelector(selectType)
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <h2>Choose your story type</h2>
      </Grid>
      {storyTypeOptions.map(({ type, label, icon }) => (
        <Grid item xs={12} sm={3} key={type} sx={{minHeight: '12em'}}>
          <StoryButton onClick={() => handleType(type)} active={activeType === type}>
            {icons[icon]}
            {label}
          </StoryButton>
        </Grid>
      ))}
    </Grid>
  );
};

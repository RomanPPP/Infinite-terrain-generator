import SliderUnstyled, { sliderUnstyledClasses } from '@mui/base/SliderUnstyled';
import { styled, alpha } from '@mui/system';
export default styled(SliderUnstyled)(
    () => `
    color: '#d0d7de';

    height: 2px;
    width: 100%;
    padding: 10px 0;
    display: inline-block;
    position: relative;
    cursor: pointer;
    touch-action: none;
    -webkit-tap-highlight-color: transparent;
  
    &:hover {
      opacity: 1;
    }
  
    
    & .${sliderUnstyledClasses.rail} {
      display: block;
      position: absolute;
      width: 100%;
      height: 2px;
      border-radius: 2px;
      background-color: currentColor;
      opacity: 0.4;
    }
  
    & .${sliderUnstyledClasses.track} {
      display: block;
      position: absolute;
      height: 2px;
      border-radius: 2px;
      background-color: currentColor;
    }
  
    & .${sliderUnstyledClasses.thumb} {
      position: absolute;
      width: 8px;
      height: 8px;
      margin-left: -3px;
      margin-top: -3px;
      box-sizing: border-box;
      border-radius: 50%;
      outline: 0;
      border: 1px solid currentColor;
      background-color: #fff;
  
      :hover,
      &.${sliderUnstyledClasses.focusVisible} {
        box-shadow: 0 0 0 0.25rem ${alpha(
            '#d0d7de',
          0.15,
        )};
      }
  
      &.${sliderUnstyledClasses.active} {
        box-shadow: 0 0 0 0.25rem ${alpha(
            '#d0d7de',
          0.3,
        )};
      }
    }
  
   
    & .${sliderUnstyledClasses.markActive} {
      background-color: #fff;
    }
  
    & .${sliderUnstyledClasses.valueLabel} {
   
      display: none;
      
  `,
  );
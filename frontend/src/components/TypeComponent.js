import React, { useState, useEffect, useContext } from 'react';
import TextComponent from './TextComponent';
import type1 from '../assets/images/type1.png';
import type2 from '../assets/images/type2.png';
import type3 from '../assets/images/type3.png';
import type4 from '../assets/images/type4.png';
import type5 from '../assets/images/type5.png';
import type6 from '../assets/images/type6.png';
import statetype1 from '../assets/images/statetype1.png';
import statetype2 from '../assets/images/statetype2.png';
import statetype3 from '../assets/images/statetype3.png';
import statetype4 from '../assets/images/statetype4.png';
import statetype5 from '../assets/images/statetype5.png';
import statetype6 from '../assets/images/statetype6.png';
import message_default from '../assets/images/message_default.png';
import message1 from '../assets/images/message1.png';
import message2 from '../assets/images/message2.png';
import message3 from '../assets/images/message3.png';
import message4 from '../assets/images/message4.png';
import message5 from '../assets/images/message5.png';
import message6 from '../assets/images/message6.png';
import { LoadingContext } from '../components/LoadingContext';

function TypeComponent({ state, detail }) {
  const { startLoading, stopLoading } = useContext(LoadingContext);
  const [imageLoaded, setImageLoaded] = useState(false);

  let imgSrc;
  switch (state) {
    case '잼민이':
      imgSrc = type1;
      break;
    case 'K-고딩':
      imgSrc = type6;
      break;
    case '샌애기':
      imgSrc = type2;
      break;
    case '화석':
      imgSrc = type3;
      break;
    case '삼촌':
      imgSrc = type4;
      break;
    case '아재':
      imgSrc = type5;
      break;
  }

  let stateImgSrc;
  switch (state) {
    case '잼민이':
      stateImgSrc = statetype1;
      break;
    case 'K-고딩':
      stateImgSrc = statetype2;
      break;
    case '샌애기':
      stateImgSrc = statetype3;
      break;
    case '화석':
      stateImgSrc = statetype4;
      break;
    case '삼촌':
      stateImgSrc = statetype5;
      break;
    case '아재':
      stateImgSrc = statetype6;
      break;
  }

  let detailImgSrc;
  switch (state) {
    case '잼민이':
      detailImgSrc = message1;
      break;
    case 'K-고딩':
      detailImgSrc = message2;
      break;
    case '샌애기':
      detailImgSrc = message3;
      break;
    case '화석':
      detailImgSrc = message4;
      break;
    case '삼촌':
      detailImgSrc = message5;
      break;
    case '아재':
      detailImgSrc = message6;
      break;
    default:
      detailImgSrc = message_default;
  }

  // 이미지가 로드되면 로딩을 멈춤
  const handleImageLoad = () => {
    setImageLoaded(true);
    stopLoading();
  };

  return (
    <div className="typeComponent">
      <img className="stateImgComponent" src={stateImgSrc} width={318} alt={state} onLoad={handleImageLoad} />

      {!imageLoaded && <TextComponent text="Loading image..." fontSize="18px" shadowSize="1.9px" />}
      <img className="imgComponent" src={imgSrc} width={198} alt={state} onLoad={handleImageLoad} />

      <img className="detailImgComponent" src={detailImgSrc} width={356} alt={detail} onLoad={handleImageLoad} />
    </div>
  );
}

export default TypeComponent;

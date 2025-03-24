import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';

interface sliderOptions {
  isOpen: boolean;
  onClose(): any;
  children: any;
  addClassToWrapper?: string;
  dots?: boolean;
  infinite?: boolean;
  speed?: number;
  slidesToShow?: number;
  slidesToScroll?: number;
}

export default function SimpleSlider({
  isOpen = false,
  onClose,
  children,
  dots = true,
  infinite = true,
  speed = 500,
  slidesToShow = 1,
  slidesToScroll = 1,
  addClassToWrapper,
}: sliderOptions) {
  var settings = {
    dots: dots,
    infinite: infinite,
    speed: speed,
    slidesToScroll: slidesToScroll,
    slidesToShow: slidesToShow,
  };
  return (
    <div
      className={
        addClassToWrapper ? 'popup-wrap ' + addClassToWrapper : 'popup-wrap'
      }
    >
      <div className="popup-box ">
        <div className="box">
          <span className="close-icon" onClick={onClose}>
            x
          </span>
          <Slider {...settings}>{children}</Slider>
        </div>
      </div>
    </div>
  );
}

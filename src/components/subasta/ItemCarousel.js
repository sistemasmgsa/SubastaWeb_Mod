import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ItemCarousel = ({ images, onClose }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: 'white', padding: '20px', borderRadius: '10px', position: 'relative' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px' }}>Close</button>
                <Slider {...settings}>
                    {images.map((img, index) => (
                        <div key={index}>
                            <img src={img} alt={`Slide ${index}`} style={{ width: '100%', height: 'auto' }} />
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
};

export default ItemCarousel;
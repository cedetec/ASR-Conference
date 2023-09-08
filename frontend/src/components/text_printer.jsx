import './components.css';
import React, { useState, useEffect } from 'react';

//Componente tipeador de texto
const TextPrinter = (props) => {
  const {TextoPrincipal, TextoSecundario, Delay} = props;

  /**********************Listado de variables**********************************
   * TextoPrincipal: Texto mostrado en parte central                          *
   * TextoSecundario: Texto mostrado en parte superior                        *
   * Delay: Tiempo entre escritura de caracter nuevo                          *
   * currentText: Texto actual mostrado en pantalla                           *
   * currentIndex: Posicion del texto actual en pantalla                      *
   * uppingAnimation: Switch de animacion para cambio de texto                *
   ****************************************************************************/
  
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [uppingAnimation, setUppingAnimation] = useState(false);

  useEffect(() => {
    setUppingAnimation(true);
    setTimeout(() => {
      setCurrentText("");
      setCurrentIndex(0);
      setUppingAnimation(false);
    }, 300)
  }, [TextoPrincipal]);

  useEffect(() => {
    if (currentIndex < TextoPrincipal.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prevText => prevText + TextoPrincipal[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, Delay);
  
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, Delay, TextoPrincipal]);

  return (
    <div className='text_printer'>
      <p className={'Parrafo_secundario ' + (uppingAnimation?"upAnim2":"")}>{TextoSecundario}</p>
      <p className={'Parrafo ' + (uppingAnimation?"upAnim1":"")}>{currentText}</p>
    </div>
  );
};

export default TextPrinter;
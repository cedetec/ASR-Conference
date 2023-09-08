import './components.css';
import React, { useState, useEffect, useRef } from 'react';

const VideoGenerator = (props) => {
  const {TextoPrincipal, TextoSecundario, Time} = props;
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [uppingAnimation, setUppingAnimation] = useState(false);

  const [lastSecText, setLastSecText] = useState("");

  const videoRef = useRef(null);
  const [lienzo, setLienzo] = useState(null);
  const [contexto, setContexto] = useState(null);

  const [pixels, setPixels] = useState(-1);

  /**********************Listado de variables**********************************
   * TextoPrincipal: Texto mostrado en parte central                          *
   * TextoSecundario: Texto mostrado en parte superior                        *
   * Time: Tiempo que dura la escritura de una linea                          *
   * currentText: Texto actual mostrado en pantalla                           *
   * currentIndex: Posicion del texto actual en pantalla                      *
   * uppingAnimation: Switch de animacion para cambio de texto                *
   * lastSecText: Ultimo texto secundario                                     *
   * videoRef: Referencia al componente de video                              *
   * lienzo: Lienzo que se modifica para la creacion del video                *
   * contexto: Contexto para editar el lienzo                                 *
   * pixels: Contador de pixeles para la animacion de cambio de texto         *
   ****************************************************************************/

  //Efecto para la iniciacion del componente, crea el componente canvas para el video
  useEffect(()=>{
    setLienzo(document.createElement('canvas'));
  },[]);

  //Efecto para el cambio de lienzo, el componente empieza cuando se genere correctamente el lienzo
  useEffect(()=>{
    if (lienzo){
      lienzo.width = videoRef.current.clientWidth;
      lienzo.height = videoRef.current.clientHeight;

      setContexto(lienzo.getContext('2d'));

      videoRef.current.srcObject = lienzo.captureStream(30);
    }
  },[lienzo]);

  //Efecto para el cambio del texto principal, se activa la animacion de subida
  useEffect(() => {
    setUppingAnimation(true);
    setTimeout(() => {
      setCurrentText("");
      setCurrentIndex(0);
      setUppingAnimation(false);
    }, 500)
  }, [TextoPrincipal]);

  //Efecto para la activacion de la animacion de subida
  useEffect(() => {
    if(uppingAnimation){
      setPixels(0);
    }
  }, [uppingAnimation]);

  //Efecto para el cambio de pixeles, animacion de subida
  useEffect(()=>{
    if (pixels < 55 && contexto){
      //Se determinan los colores, negro y gris
      const color1 = Math.floor((pixels/54)*127);
      const color2 = Math.floor((pixels/54)*127)+127;

      //Se pinta el fondo blanco
      contexto.fillStyle = 'white';
      contexto.fillRect(0, 0, lienzo.width, lienzo.height);
      
      //Se pinta el texto secundario con cambios respecto a los pixeles
      contexto.font = `${200-((pixels/54)*100)} ${30-((pixels/54)*15)}px Arial`;
      contexto.fillStyle = `rgb(${color2}, ${color2}, ${color2})`;
      contexto.fillText(lastSecText, 20, 50-pixels+1);

      //Se pinta el texto principal con cambios respecto a los pixeles
      contexto.font = `${400-((pixels/54)*200)} ${35-((pixels/54)*5)}px Arial`;
      contexto.fillStyle = `rgb(${color1}, ${color1}, ${color1})`;
      contexto.fillText(TextoSecundario, 20, 105-pixels+1);

      //Loop de cambio de pixeles
      setTimeout(()=>{setPixels(pixels+1)}, 1);
    }else if(pixels == 55){
      //Se pinta el fondo blanco
      contexto.fillStyle = 'white';
      contexto.fillRect(0, 0, lienzo.width, lienzo.height);

      //Se pinta el texto secundario
      contexto.font = '30px Arial';
      contexto.fillStyle = 'gray';
      contexto.fillText(TextoSecundario, 20, 50);

      //Se guarda el texto secundario
      setLastSecText(TextoSecundario);
    }
  }, [pixels]);

  //Efecto para el cambio del texto principal, se escribe en el canvas el texto actual
  useEffect(() => {
    //Se activa unicamente si aun no se completa la pintura del texto principal, si no se esta realizando la animacion de subida y si el canvas esta activo
    if (currentIndex < TextoPrincipal.length && !uppingAnimation && contexto) {
      //Escritura de los caracteres
      setTimeout(() => {
        //Se pinta el fondo blanco
        contexto.fillStyle = 'white';
        contexto.fillRect(0, 70, lienzo.width, lienzo.height);

        //Se pinta el texto principal
        contexto.font = '400 35px Arial';
        contexto.fillStyle = 'black';
        contexto.fillText(currentText + TextoPrincipal[currentIndex], 20, 105);
        
        //Se modifican las variables del texto actual y su index
        setCurrentText(prevText => prevText + TextoPrincipal[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, Time/TextoPrincipal.length);
    }
  }, [currentIndex, Time, TextoPrincipal]);

  return (
    <video className='printedVideo' ref={videoRef} autoPlay muted />
  );
};

export default VideoGenerator;
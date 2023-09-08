import React, { useEffect, useState } from 'react';
import Microphone from '../components/microphone';
import TextPrinter from '../components/text_printer';
import './pages.css';

//Pagina principal
function MainPage() {
  const [pos, setPos] = useState(0);
  const [PrinText, SetPrinText] = useState("");
  const [SecText, SetSecText] = useState("");
  const text =  ["Praesent condimentum augue at consectetur ullamcorper.",
                "Proin dignissim quam est, vitae congue orci tristique et.",
                "Nam placerat quam at auctor mollis.",
                "Donec ullamcorper porta sapien, sed ornare elit laoreet vitae.",
                "Proin posuere lorem eget sodales vestibulum.",
                "Etiam vel massa quis turpis vulputate ultricies quis tincidunt arcu.",
                "Suspendisse interdum mi quis dui scelerisque congue.",
                "Mauris lacinia odio eu tortor cursus tempor non sed mauris.",
                "Integer tincidunt commodo lorem quis vehicula. Integer ac odio felis.",
                "Proin cursus orci nec metus aliquet elementum.",
                "Pellentesque consectetur commodo ante dignissim pulvinar.",
                "Aliquam vitae condimentum nulla.",
                "Etiam commodo viverra felis, vitae scelerisque libero rutrum at.",
                "Nam sed commodo nulla."];

  /**********************Listado de variables**********************************
   * pos: Posicion del texto para el listado de prueba                        *
   * PrinText: Texto principal                                                *
   * SecText: Texto secundario                                                *
   * text: Texto de prueba                                                    *
   ****************************************************************************/

  //Efecto al iniciar el componente, se empieza a añadir el texto de prueba
  useEffect(()=>{
    addText();
  }, []);
  
  //Efecto al cambiar el texto principal, se realiza un loop
  useEffect(()=>{
    setTimeout(()=>{
      addText();
    }, 3500);
  }, [PrinText]);

  //Funcion que envia el texto de prueba
  const addText = () => {
    SetPrinText(text[pos]);
    SetSecText(text[pos-1 === -1? text.length-1: pos-1])
    if (pos + 1 === text.length){
      setPos(0);
    }else{
      setPos(pos+1);
    }
  }

  return (
    <div className="main_page">
      <div className='main_page_microphone_container'>
        <Microphone/>
      </div>
      <div className='main_page_text_printer_containter'>
        <TextPrinter TextoPrincipal={PrinText} TextoSecundario={SecText} Delay={40}/>
      </div>
      
    </div>
  );
}

export default MainPage;

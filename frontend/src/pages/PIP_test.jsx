import React, { useEffect, useRef, useState } from 'react';
import Microphone from '../components/microphone_v2';
import VideoGenerator from '../components/video_generator';
import AudioManager from '../managers/audio_manager';
import './pages.css';
import SetupForm from '../components/setup_form';

function PIPTest() {
  const [PrinText, SetPrinText] = useState("");
  const [SecText, SetSecText] = useState("");
  const [ResponseText, SetResponseText] = useState("");
  const [Enabled, SetEnabled] = useState(false);

  /**********************Listado de variables**********************************
   * PrinText: Texto principal                                                *
   * SecText: Texto secundario                                                *
   * ResponseText: Texto de respuesta del servidor                            *
   ****************************************************************************/

  //Efecto para la respuesta del servidor, se modifica el texto para que entre bien en el contenedor
  useEffect(()=>{
    //Si el texto es mayor a 80 caracteres se corta en dos
    if (ResponseText.length > 80){
      let Sliced = ResponseText.split(" ");
      let counter = 0;
      let Text1 = "";
      let Text2 = "";
      while ( Text1.length + Sliced[counter].length < 80 ){
        Text1 = Text1 + Sliced[counter] + " ";
        counter++;
      }
      while ( counter < Sliced.length){
        Text2 = Text2 + Sliced[counter] + " ";
        counter++;
      }
      setTimeout(()=>{SetResponseText(Text2)}, 1500);
      SetResponseText(Text1);
    }else{
      SetSecText(PrinText);
      SetPrinText(ResponseText);
    }
  },[ResponseText]);

  return (
    <div className="main_page">
      <div className='main_page_microphone_container'>
        <Microphone sendAudio={(e) => {AudioManager.SendAudio(e, SetResponseText)}} Enabled={Enabled}/>
      </div>
      <div className='pip_test_text_printer_containter'>
        <VideoGenerator TextoPrincipal={PrinText} TextoSecundario={SecText} Time={1000}/>
      </div>
      <div className='pip_test_setup_form'>
        <SetupForm SetEnabled={(e)=>{SetEnabled(e)}}/>
      </div>
    </div>
  );
}

export default PIPTest;

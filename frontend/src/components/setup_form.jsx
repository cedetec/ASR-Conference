import './components.css';
import React, { useState, useEffect } from 'react';
import ServerManager from '../managers/server_manager';

//Componente tipeador de texto
const SetupForm = (props) => {
  const { SetEnabled } = props;

  /**********************Listado de variables**********************************
   * SetEnabled: Funcion para determinar si se puede detectar el microfono    *
   * languageList: Listado de lenguajes para deteccion/traduccion             *
   * reductedLanguageList: Listado de lenguajes minimizado                    *
   * modelList: Listado de modelos                                            *
   * selectedInLanguage: Lenguaje de entrada seleccionado                     *
   * selectedOutLanguage: Lenguaje de salida seleccionado                     *
   * selectedModel: Modelo seleccionado                                       *
   * loaded: Switch que determina si los listados cargaron                    *
   * errorText: Variable con texto de error                                   *
   ****************************************************************************/

  const [languageList, setLanguageList] = useState([]);
  const [reductedLanguageList, setReductedLanguageList] = useState([]);
  const [modelList, setModelList] = useState([]);
  const [selectedInLanguage, setSelectedInLanguage] = useState("");
  const [selectedOutLanguage, setSelectedOutLanguage] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [waitingResponse, setWaitingResponse] = useState(false);

  useEffect(() => {
    ServerManager.GetData(setLanguageList, setReductedLanguageList, setModelList);
  }, []);

  useEffect(() => {
    if (languageList.length && reductedLanguageList.length && modelList.length){
      setLoaded(true);
      setSelectedInLanguage(languageList[0]);
      setSelectedOutLanguage(languageList[0]);
      setSelectedModel(modelList[0]);
    }
  }, [languageList, reductedLanguageList, modelList]);

  const sendData = () => {
    ServerManager.StartServer(selectedModel, selectedInLanguage, selectedOutLanguage, SetEnabled, setWaitingResponse, setErrorText);
    setWaitingResponse(true);
  }

  return (
    <div className='setupForm'>
      {loaded ?
        <>
          <h3>Opciones de servidor</h3>
          <div className='optionDiv'>
            Lenguaje de entrada: 
            <select className="selectStyle" name="EntryLang" id="entryLang" defaultValue="none" onChange={(e) => {setSelectedInLanguage(e.target.value)}}> 
              <option defaultValue="none" key="-1">Seleccione</option>
              {languageList.map((lang, i)=>{
                return <option value={reductedLanguageList[i]} key={i}>{lang}</option>
              })}
            </select>
          </div>
          <div className='optionDiv'>
            Lenguaje de salida:
            <select className="selectStyle" name="OutLang" id="outLang" defaultValue="none" onChange={(e) => {setSelectedOutLanguage(e.target.value)}}>
              <option defaultValue="none" key="-1">Seleccione</option>
              {languageList.map((lang, i)=>{
                return <option value={reductedLanguageList[i]} key={i}>{lang}</option>
              })}
            </select>
          </div>
          <div className='optionDiv'>
            Modelo:
            <select className="selectStyle" name="Model" id="model" onChange={(e) => {setSelectedModel(e.target.value)}}>
              {modelList.map((model)=>{
                return <option value={model}>{model}</option>
              })}
            </select>
          </div>
          <div className='optionDiv'>
            <button className="butonStyle" onClick={()=>{sendData()}}>Seleccionar</button>
            {waitingResponse?
              <img src="Load_animation.svg" className="Loading" title='Cargando' alt=""/>
            :
              ""}
          </div>
          {errorText != "" ?
           <p>{errorText}</p>
          :
            ""
          }
        </>
        :
        ""
      }
    </div>
  );
};

export default SetupForm;
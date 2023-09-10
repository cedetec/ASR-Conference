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
    ServerManager.StartServer(selectedModel, selectedInLanguage, selectedOutLanguage, SetEnabled, setErrorText);
  }

  return (
    <div className='setupForm'>
      {loaded ?
        <>
          <div className='optionDiv'>
            Lenguaje de entrada: 
            <select className="selectStyle" name="EntryLang" id="entryLang" onChange={(e) => {setSelectedInLanguage(e.target.value)}}> 
              {languageList.map((lang, i)=>{
                return <option value={reductedLanguageList[i]}>{lang}</option>
              })}
            </select>
          </div>
          <div className='optionDiv'>
            Lenguaje de salida:
            <select className="selectStyle" name="OutLang" id="outLang" onChange={(e) => {setSelectedOutLanguage(e.target.value)}}>
              {languageList.map((lang, i)=>{
                return <option value={reductedLanguageList[i]}>{lang}</option>
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
          <button className="butonStyle" onClick={()=>{sendData()}}>Seleccionar</button>
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
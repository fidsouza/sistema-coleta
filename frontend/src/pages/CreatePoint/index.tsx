import React , {useEffect, useState , ChangeEvent, FormEvent} from 'react'
import {Link ,useHistory} from 'react-router-dom'
import {FiArrowLeft,FiThumbsUp} from 'react-icons/fi'
import { Map, TileLayer, Marker } from 'react-leaflet'
import api from '../../service/api'
import {LeafletMouseEvent} from 'leaflet'
import Axios from 'axios'


import './styles.css'
import logo from '../../assets/logo.svg'

interface item {
    id:number,
    title:string,
    image_url : string
}

interface ufs {
    id : number,
    sigla : string,
    nome : string
}

interface IBGECity {
    id : number,
    nome:string
}


const CreatePoint = () => {
   const [items,setItems] = useState<item[]>([])
   const [ufItems,setUfitems] = useState<ufs[]>([])
   const[cities,setCities] = useState<string[]>([])


   const [selectedUf,setSelectedUf] = useState('0')
   const [selectedCity,setSelectedCity] = useState('0')
   const [selectedItems, setselectedItems] = useState<number[]>([])
   const [selectedMarkerMap, setSelectedMarkerMap] = useState<[number,number]>([0,0])
   const [initialPositionMap, setInitialPositionMap] = useState<[number,number]>([0,0])
   const [alreadyPoint , setalreadyPoint] = useState<string>('')
 
   const [formData , setFormData]= useState({

       name:'',
       email:'',
       whatsapp:''

   })

   const history = useHistory()

   useEffect(function(){
     navigator.geolocation.getCurrentPosition(position => {
         setInitialPositionMap([position.coords.latitude,position.coords.longitude])
     })
   },[])

   useEffect( function(){
       api.get('/items').then(function(response){
           setItems(response.data)
       })
   },[])

   useEffect(() =>{
       Axios.get<ufs[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
        setUfitems(response.data)
       })
   },[])

   useEffect(() => {
        if(selectedUf === '0') {
            return
        }

        Axios.get<IBGECity[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
             .then(response => {
                const citiesNames = response.data.map(city => city.nome)
                setCities(citiesNames)
           })

   },[selectedUf])

   function handleSelectUf(event :ChangeEvent<HTMLSelectElement>) {
     const uf =  event.target.value
     setSelectedUf(uf)
   }
   function handleSelectCity(event :ChangeEvent<HTMLSelectElement>) {
    const city =  event.target.value
    setSelectedCity(city)
  }

  function handleMapClick(event: LeafletMouseEvent){
     setSelectedMarkerMap([
         event.latlng.lat,
         event.latlng.lng
     ])
  }

  function handleInputChange( event : ChangeEvent<HTMLInputElement>){
     const {name , value } = event.target

     setFormData({ ...formData ,  [name]: value })
  }

  function handleSelectItem (id : number){
     
      const alreadySelected = selectedItems.findIndex( item => item ===  id)
      console.log(alreadySelected)
      if(alreadySelected >= 0 ){
        const filteredItems = selectedItems.filter(item => item !== id)
        setselectedItems(filteredItems)
      }else{
        
        setselectedItems([...selectedItems, id])
      }

  }

  async function handleSubmit(event : FormEvent) {
    event.preventDefault()

    const {name , email , whatsapp} = formData
    const uf = selectedUf
    const city = selectedCity
    const [latitude , longitude] = selectedMarkerMap
    const items = selectedItems

    const data = {
        name,
        email,
        whatsapp,
        uf,
        city,
        latitude,
        longitude,
        items
        
    }

    await api.post('points',data)

    document.body.style.overflow ="hidden"
    document.documentElement.scrollTop = 0
    setalreadyPoint('1')

  }

  function handClickClosed(){
    document.body.style.overflow ="initial"
    setalreadyPoint('')
    history.push('/')
  }


   return (
       <div id="page-create-point">
           <header>
               <img src={logo} alt="Ecoleta"/>

               <Link to ="/">
                   <FiArrowLeft/>
                   Voltar
               </Link>
           </header>
           <form onSubmit={handleSubmit}>
            <h1>Cadastro do <br/> ponto de coleta</h1>

            <fieldset>
                <legend>
                    <h2>Dados</h2>
                </legend>
                <div className="field">
                    <label htmlFor="name">Nome</label>
                    <input 
                    type="text"
                    name="name"
                    id="name"
                    onChange={handleInputChange}/>
                </div>
                <div className="field-group">
                    <div className="field">
                        <label htmlFor="email">E-mail</label>
                        <input 
                        type="email"
                        name="email"
                        id="email"
                        onChange={handleInputChange}/>
                    </div>
                    <div className="field">
                        <label htmlFor="name">WhatsApp</label>
                        <input 
                        type="text"
                        name="whatsapp"
                        id="whatsapp"
                        onChange={handleInputChange}/>
                    </div>
                </div>
            </fieldset>

            <fieldset>
                <legend>
                    <h2>Endereço</h2>
                    <span>
                    Selecione o endereço no mapa
                    </span>
                </legend>
                <Map center={initialPositionMap} zoom={15} onClick={handleMapClick}>
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={selectedMarkerMap}></Marker>
                </Map>
                <div className="field-group">
                    <div className="field">
                        <label htmlFor="uf">Estado(UF)</label>
                        <select name="uf" 
                                id="uf" 
                                onChange={handleSelectUf}>
                                

                            <option  value={selectedUf}>Selecione uma UF</option>
                            {ufItems.map(uf =>(
                              <option key={uf.id} value={uf.sigla}>{uf.nome}</option>
                            ))}
                        </select>

                    </div>
                    <div className="field">
                        <label htmlFor="city">Cidade</label>
                        <select name="city" 
                                id="city"
                                value={selectedCity}
                                onChange={handleSelectCity}>
                            <option value="0">Selecione uma Cidade</option>
                            {cities.map(city =>(
                              <option key={city} value={city}>{city}</option>
                            ))}

                        </select>
                    </div>
                </div>
            </fieldset>
            <fieldset>
                <legend>    
                    <h2>Itens de Coleta</h2>
                    <span>Seleione um ou mais items de coleta</span>
                </legend>
                <ul className="items-grid">
                  {items.map(item => 
                        <li key={item.id}
                            onClick={() => handleSelectItem(item.id)}
                            className={selectedItems.includes(item.id) ? 'selected' : '' }>
                            <img src={item.image_url} alt="Oleo"/>
                            <span>{item.title}</span>
                        </li>
                     )}

                </ul>
            </fieldset>
            <button type="submit">
                Cadastrar Ponto de Coleta
            </button>
           </form>
          {alreadyPoint && (
           <div className="already-point">
                <p><FiThumbsUp/></p>
                <strong>Cadastro Concluído</strong>
                <span onClick={handClickClosed}>Fechar</span>
           </div>
          )} 

       </div>
   )
}

export default CreatePoint 
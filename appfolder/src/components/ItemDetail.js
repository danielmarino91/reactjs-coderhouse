import ItemCount from "./ItemCount"
import { useContext, useState } from "react"
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom"
import { contexto } from "./CartContext"

function ItemDetail({ detalle }) {

  const [seleccionado, setseleccionado] = useState(false);
  const resultado = useContext(contexto)
  const addItem = resultado.addItem

  const onAdd = (unidadSeleccionada) => {

    if ((unidadSeleccionada != undefined) && (unidadSeleccionada > 1)) {
      setseleccionado(unidadSeleccionada)
      toast.success(`Se agregaron ${unidadSeleccionada} copias de ${detalle.nombre} al carrito`)
    }
    else if (unidadSeleccionada === 1) {
      setseleccionado(unidadSeleccionada)
      toast.success(`Se agrego ${unidadSeleccionada} copia de ${detalle.nombre} al carrito`)
    }
  }

  return (
    <div className="itemDetail">
      <div className="itemDetail__image">
        <img src={detalle.imagen}></img>
      </div>

      <div className="itemDetail__detail">
        <p className="itemDetail__detail--title">{detalle.nombre}</p>
        <p className="itemDetail__detail--price">${detalle.precio}</p>
        <p><span>Información:</span> {detalle.detalle}</p>
        <p><span>Categoría:</span> {detalle.categoria}</p>
        <p><span>Plataformas:</span> {detalle.plataforma}</p>
        
      </div>

      <div className="itemDetail__buttons">
        {seleccionado ? <div className="goCart"><NavLink to="/carrito"><button onClick={() => { addItem(detalle.id, detalle.nombre, detalle.precio, detalle.imagen, seleccionado) }}>Terminar compra</button></NavLink></div> : <><span><span>Stock disponible:</span> {detalle.stock}</span><ItemCount title={detalle.nombre} initial={1} stock={detalle.stock} onAdd={onAdd} /></>}
      </div>
    </div>
  )
}

export default ItemDetail
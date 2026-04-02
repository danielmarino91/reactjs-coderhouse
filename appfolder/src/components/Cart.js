import React from 'react'
import { BsFillCartXFill } from "react-icons/bs"
import { useContext, useState } from "react"
import { contexto } from "./CartContext"
import { NavLink } from "react-router-dom"
import { toast } from 'react-toastify'
import { db } from "./Firebase"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import SuccesBuy from "./SuccesBuy"

const Cart = () => {

  const cartContext = useContext(contexto)
  const { emptyCart, removeItem, cart, total, currency, setTotal } = cartContext
  const [BuyComplete, setBuyComplete] = useState(false)
  const [BuyInProgress, setBuyInProgress] = useState(false)
  const [Order, setOrder] = useState({})

  const userCart = cart

  const checkOut = () => {

    const userName = document.getElementById("orderName").value;
    const userPhone = document.getElementById("orderPhone").value;
    const userMail = document.getElementById("orderMail").value;

    if ((userName === "") || (userPhone === "") || (userMail === "")) {
      toast.error("Complete todos los campos")
    }
    else if (isNaN(userPhone)) {
      toast.error("Ingrese un número de teléfono válido")
    }
    else {
      setBuyInProgress(true)
      const userOrder = {
        buyer: {
          name: document.getElementById("orderName").value,
          phone: document.getElementById("orderPhone").value,
          mail: document.getElementById("orderMail").value,
        },
        items: userCart,
        date: serverTimestamp(),
        total: total
      }

      setOrder(userOrder)
      const cartCollection = collection(db, "orders")
      const generateOrder = addDoc(cartCollection, userOrder)

      generateOrder
        .then(res => toast.success(`La compra se efectuo con exito, el ID de la compra es ${res.id}`))
        .catch((err) => toast.error(err))
        .finally(() => emptyCart())
        .finally(() => setTotal(0))
        .finally(() => setBuyInProgress(false))
        .finally(() => setBuyComplete(true))
    }
  }

  if (BuyComplete === true) {
    return (<SuccesBuy name={Order.buyer.name} phone={Order.buyer.phone} email={Order.buyer.mail} total={Order.total} items={Order.items} />)
  }
  else {
    return (
      <>
        {userCart <= 1 ? <div className="cartStyle"><p>El carrito está vacío</p><BsFillCartXFill /><NavLink to="/"><button className="btnGoIndex">Ver más productos</button></NavLink></div>
          :
          <>
            <div className="inCart">
              <div className="inCart__products">
                {userCart.map(item => (<div className="itemInCart" key={`uniqueID${item.id}`}>
                  <img src={item.imagen} alt={item.item}></img>
                  <div className="itemInCart__details">
                    <h3><span>Título: </span>{item.item}</h3>
                    <h3><span>Precio: </span>{currency.format(item.precio)}</h3>
                    <h3><span>Cantidad: </span>{item.stock}</h3>
                  </div>
                  <NavLink to={`/item/${item.id}`}><button>Comprar más</button></NavLink>
                  <button onClick={() => { removeItem(item.id, item.stock, item.precio) }}>Borrar</button>
                </div>))}
              </div>
              <div className="inCart__buttons">
                <div className="inCart__buttons--form">
                  <h3>Ingrese sus datos</h3>
                  <p>Nombre</p>
                  <input id="orderName" placeholder="Nombre" maxLength="30" type="text" required></input>
                  <p>Teléfono</p>
                  <input id="orderPhone" placeholder="Teléfono" maxLength="15" type="tel" required></input>
                  <p>Mail</p>
                  <input id="orderMail" placeholder="Mail" maxLength="35" type="email" required></input>
                </div>
                <p className="inCart__buttons--total">Total: <span>{currency.format(total)}</span></p>
                <hr></hr>
                <div className="inCart__buttons--buttons">
                  {BuyInProgress === false ? <><button className="btnBuy" onClick={checkOut}>Terminar compra</button>
                    <button className="btnClearCart" onClick={emptyCart}>Limpiar carrito</button>
                    <NavLink to="/"><button className="btnGoIndex">Ver más productos</button></NavLink>
                  </> :
                    <button className="btnBuyInProgress">Espere, por favor</button>}

                </div>
              </div>
            </div>
          </>}
      </>
    )
  }
}

export default Cart

import { createContext, ReactNode, useState } from "react"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

import { SnackData } from "../Interfaces/SnackData"

import { snackEmoji } from "../Helpers/snackEmoji"
import { CustomerData } from "../Interfaces/CustomerData"

interface Snack extends SnackData{
  quantity:number
  subtotal: number
}

interface CartContextProps{
  cart:Snack[]
  addSnackIntoCart: (snack: SnackData) => void
  removeSnackFromCart: (snack:Snack ) => void
  snackCartIncrement: (snack:Snack ) => void
  snackCartDecrement: (snack:Snack ) => void
  confirmOrder: ( ) => void
  payOrder: ( customer: CustomerData) => void
}

interface CartProviderProps{
  children: ReactNode
}

export const CartContext = createContext({} as CartContextProps)

const localStorageKey = '@wburguer:cart'

export function CartProvider ({children}: CartProviderProps ){
  const navigate = useNavigate();
  const [cart, setCart] = useState<Snack[]>(() => {

 //Salvando e recuperando as informações no LocalStorage
    const value = localStorage.getItem(localStorageKey)
      if(value) return JSON.parse(value)

    return []
  });

  function saveCart(items: Snack[]) {
    setCart(items)
    localStorage.setItem(localStorageKey , JSON.stringify(items))
  }

 //Zerando as informaçõoes do carrinho apos a compra
  function clearCart(){
    localStorage.removeItem(localStorageKey)
  }

  function addSnackIntoCart(snack: SnackData):void{
    //Buscar
    const snackExistentInCart = cart.find((item) => item.snack === snack.snack && item.id === snack.id)

    //Atualizar
    if(snackExistentInCart){
      const newCart = cart.map((item) => {
        if(item.id === snack.id){
          const quantity =  item.quantity + 1
          const subtotal = item.price * quantity

          return {...item, quantity, subtotal}
        }
        return item
      })
      toast.success(`Outro(a) ${snackEmoji(snack.snack)} ${snack.name} adicionado aos pedidos!`)
      saveCart(newCart)

      return
    }

    //adicionar

    const newSnack = {...snack, quantity: 1 , subtotal: snack.price}
    const newCart = [...cart,newSnack ]

    toast.success(`${snackEmoji(snack.snack)} ${snack.name} foi adicionado aos pedidos!`)
    saveCart(newCart)
  }

  //Remover pedido
  function removeSnackFromCart(snack: Snack){
    const newCart = cart.filter((item) => !(item.id === snack.id && item.snack === snack.snack))

    saveCart(newCart)
  }


  function updateSnackQuantity(snack: Snack, newQuantity:number){
    if(newQuantity <= 0 ) return

    const snackExistentInCart = cart.find((item) => item.id === snack.id && item.snack === snack.snack)

    if(!snackExistentInCart) return

    const newCart =  cart.map((item) => {
      if(item.id === snackExistentInCart.id && item.snack === snackExistentInCart.snack){
        return{
          ...item,
          quantity: newQuantity,
          subtotal: item.price * newQuantity,
        }
      }
      return item
    })

    saveCart(newCart)
  }

  //Incrementar item
  function snackCartIncrement(snack: Snack){
    updateSnackQuantity(snack,snack.quantity +1)
  }

  //Decrementar item
  function snackCartDecrement(snack: Snack){
    updateSnackQuantity(snack,snack.quantity -1)
  }

  //Confirmar pedido
  function confirmOrder(){
    navigate ('/payment')
  }

  //COnfirmar pagamento

  function payOrder(customer: CustomerData){
    console.log('payOrder', cart, customer)

    //chamada de API BackEnd
    clearCart()

  return
  }

  return (
    <CartContext.Provider
    value={{
      cart,
      addSnackIntoCart,
      removeSnackFromCart,
      snackCartIncrement,
      snackCartDecrement,
      confirmOrder,
      payOrder
      }}>
      {children}
    </CartContext.Provider>
  )
}


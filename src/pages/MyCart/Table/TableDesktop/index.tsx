import { FaTrashAlt } from 'react-icons/fa'

import { currencyFormat } from "../../../../Helpers/currencyFormat"
import { useCart } from "../../../../Hooks/useCart"
import { Container } from "./styles"

import plusImg from '../../../../assets/circle-plus.svg'
import minusImg from '../../../../assets/circle-minus.svg'

export function TableDesktop() {
  const { cart, removeSnackFromCart, snackCartIncrement, snackCartDecrement } = useCart()
  return (
    <Container>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Pedidos</th>
            <th>Quantidade</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {
            cart.map((item) => (
              <tr key={`${item.snack}-${item.id}`}>
                <td>
                  <img src={item.image} alt={item.name} />
                </td>
                <td>
                  <h4>{item.name}</h4>
                  <span>{currencyFormat(item.price)}</span>
                </td>
                <td>
                  <div>
                    <button type="button" onClick={() => snackCartDecrement(item)}>
                      <img src={minusImg} alt='Remover' />
                    </button>
                    <span>
                      {`${item.quantity}`.padStart(2, '0')}
                    </span>
                    <button type="button" onClick={() => snackCartIncrement(item)}>
                      <img src={plusImg} alt='Adicionar' />
                    </button>
                  </div>
                </td>
                <td><h5>{currencyFormat(item.subtotal)}</h5></td>
                <td>
                  <button type='button' onClick={() => removeSnackFromCart(item)}>
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </Container>
  )
}
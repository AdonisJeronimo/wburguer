import { currencyFormat } from "../../../Helpers/currencyFormat"
import { useCart } from "../../../Hooks/useCart"
import { Container } from "../style"

export function PayOrder(){
  const {cart} = useCart()

  const totalAmount = cart.reduce((acc, item) => (acc += item.subtotal), 0)

  return(
    <Container>
      <button type="submit">Pagar</button>
      <span>
        Total <strong>{currencyFormat(totalAmount)}</strong>
      </span>
    </Container>
  )
}
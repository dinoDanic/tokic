import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Container,
  Coupon,
  TotalPrice,
  Sum,
  PriceValue,
  HoldInfo,
  GotCoupon,
  CouponHolder,
  FullPrice,
  Text,
  Discount,
  DiscountValue,
  FullPriceHold,
  CouponSuccess,
  CouponFail1,
} from "./price.styles";

import { coupons } from "../../../../../../mock/coupons";

import Input from "../../../../../../theme/ui-components/input/input.component";
import Button from "../../../../../../theme/ui-components/button/button.component";
import { setDiscount } from "../../../../../../redux/config/config.actions";
import { decNumber } from "../../../../../../utils";

const Price = ({ price }) => {
  const discount = useSelector((state) => state.config.discount);
  const dispatch = useDispatch();
  const [isCoupon, setIsCoupon] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [couponValue, setCouponValue] = useState(discount);
  const [discountValue, setDiscountValue] = useState(null);
  const [priceWithDiscount, setPriceWithDiscount] = useState(null);
  const [couponSuccess, setCouponSuccess] = useState(false);
  const [couponFail, setCouponFail] = useState(false);

  useEffect(() => {
    if (couponValue) {
      const dv = (price * couponValue) / 100;
      const newPrice = price - dv;
      setPriceWithDiscount(newPrice);
      setDiscountValue(dv);
      setCouponSuccess(true);
    }
  }, [couponValue, price]);

  const handleCoupon = () => {
    const findCoupon = coupons.filter((coupon) => coupon.name === couponInput);
    const theCoupon = findCoupon[0];

    if (theCoupon !== undefined) {
      setCouponValue(theCoupon.value);
      dispatch(setDiscount(theCoupon.value));
      setCouponSuccess(true);
      setIsCoupon(false);
      setCouponFail(false);
      return;
    } else {
      setCouponFail(true);
      setCouponSuccess(false);
      setIsCoupon(false);
      setCouponValue(null);
      dispatch(setDiscount(null));
    }
  };

  return (
    <Container>
      <HoldInfo>
        <Coupon>
          {isCoupon ? (
            <CouponHolder>
              <Input
                placeholder="Unesite kod kupona ovdje"
                onChange={(e) => setCouponInput(e.target.value)}
              />
              <Button onClick={() => handleCoupon()}>Primjeni</Button>
            </CouponHolder>
          ) : (
            <GotCoupon onClick={() => setIsCoupon(true)}>imam kupon</GotCoupon>
          )}
        </Coupon>
        {couponFail && (
          <CouponFail1>Unijeli ste pogrešan kod, pokušajte opet</CouponFail1>
        )}
        {couponValue && (
          <>
            {couponSuccess && (
              <CouponSuccess>
                Hvala vam, unijeli ste ispravan kod kupona
              </CouponSuccess>
            )}
            <FullPriceHold>
              <Text>OSNOVICA :</Text>
              <FullPrice> {decNumber(price)} kn</FullPrice>
            </FullPriceHold>
            <Discount>
              <Text>Popust {couponValue}% :</Text>
              <DiscountValue>- {decNumber(discountValue)} kn</DiscountValue>
            </Discount>
          </>
        )}
        <TotalPrice>
          <Sum>Ukupno:</Sum>
          {couponValue ? (
            <PriceValue>{decNumber(priceWithDiscount)} kn</PriceValue>
          ) : (
            <PriceValue>{decNumber(price)} kn</PriceValue>
          )}
        </TotalPrice>
      </HoldInfo>
    </Container>
  );
};

export default Price;

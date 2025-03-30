/* istanbul ignore next */
export const getVND = (value: number | string) => {
  const num = Number(value);
  return num.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};

export function numberWithCommas(x: number | string) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

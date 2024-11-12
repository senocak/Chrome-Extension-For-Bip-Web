function polling(): void {
  console.log("polling")
  setTimeout(polling, 1_000 * 30)
}
polling()

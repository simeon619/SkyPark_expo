export function generateTimestampUUID() {
  const timestamp = Date.now().toString(16);
  const randomPart = Math.floor(Math.random() * 1000000000).toString(16);

  const randomPartPadded = randomPart.padStart(9, '0');

  const uuid = timestamp + '_' + randomPartPadded;

  return uuid;
}

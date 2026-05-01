/**
 * Curated IoT jokes, puns, and fun facts for the community dashboard.
 * Displayed in the FunFactSlide and sprinkled into the ticker.
 */
export const IOT_JOKES: string[] = [
  // --- Jokes & Puns ---
  "Why did the IoT device break up with the cloud? Too much latency in the relationship.",
  "My smart fridge and I aren't on speaking terms. It gave me the cold shoulder.",
  "A WiFi router walks into a bar. The bartender says, 'We don't serve your type here.' The router says, 'That's fine, I'm just here for the connection.'",
  "Why did the sensor go to therapy? It had too many unresolved triggers.",
  "What's an IoT developer's favorite band? The Bluetooth Oyster Cult.",
  "Did you hear about the WiFi wedding? The ceremony was terrible, but the reception was amazing.",
  "Why did the Raspberry Pi get promoted? It had all the right connections.",
  "An Arduino and a Raspberry Pi walk into a bar. The Arduino says, 'I'll have a byte.' The Pi says, 'Make mine a slice.'",
  "My smart thermostat is passive-aggressive. It keeps giving me the cold shoulder when I ignore its suggestions.",
  "How many IoT engineers does it take to change a lightbulb? None — but first they need to connect it to WiFi.",
  "Why don't IoT devices ever win at poker? They always show their hand... shake.",
  "The first rule of IoT: if it doesn't need to be connected to the internet, someone will connect it anyway.",
  "I told my smart speaker a joke. It laughed 3 seconds later. Cloud-based humor.",
  "Why was the MQTT broker so popular at parties? Because it's great at handling pub/sub conversations.",
  "My smart doorbell proposed to my smart lock. It asked, 'Will you let me in?'",
  "Debugging IoT is like being a detective in a crime movie where you are also the murderer.",
  "I named my WiFi 'Yell ____ For Password' and now I know all my neighbors' names.",
  "There are only 10 types of people in IoT: those who understand binary and those who don't.",
  "Why did the LED blush? It saw the current flowing and couldn't help but glow.",

  // --- Fun Facts ---
  "Fun fact: The first IoT device was a Coke machine at Carnegie Mellon in 1982. It reported whether drinks were cold and in stock.",
  "Fun fact: By 2030, there will be roughly 30 billion IoT devices on Earth — about 4 per person.",
  "Fun fact: The term 'Internet of Things' was coined by Kevin Ashton in 1999 during a presentation at Procter & Gamble.",
  "Fun fact: A single autonomous vehicle generates about 4 terabytes of data per day. That's 4,000 hours of Netflix.",
  "Fun fact: The first webcam was invented at Cambridge to monitor a coffee pot. IoT was born from caffeine dependency.",
  "Fun fact: Indiana is home to the second-largest FedEx hub in the world. IoT logistics starts here.",
  "Fun fact: Fishers, IN has been named #1 Best Place to Live in America. Coincidence that we're here? We think not.",
  "Fun fact: A typical smart home has 20+ connected devices. The average IoT Lab member has... more.",
  "Fun fact: The ESP32 microcontroller costs about $3 and has WiFi, Bluetooth, and dual-core processing. The future is cheap.",
  "Fun fact: MQTT was invented in 1999 to monitor oil pipelines via satellite. Now it powers your smart lightbulb.",

  // --- Cheeky Observations ---
  "If your toaster and your doorbell are on the same network, congratulations — you have an IoT lab.",
  "IoT: because even your refrigerator deserves a firmware update at 3 AM.",
  "Smart home rule #1: Never let your coffee maker and your alarm clock communicate. They will conspire against you.",
  "The 'S' in IoT stands for Security.",
  "Somewhere right now, an engineer is connecting a toaster to Kubernetes. And it's probably someone in this building.",
];

/** Pick a random joke, optionally excluding a previous one to avoid repeats */
export function randomJoke(exclude?: string): string {
  const filtered = exclude ? IOT_JOKES.filter((j) => j !== exclude) : IOT_JOKES;
  return filtered[Math.floor(Math.random() * filtered.length)];
}

/** Pick n unique random jokes for ticker injection */
export function randomJokes(n: number): string[] {
  const shuffled = [...IOT_JOKES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

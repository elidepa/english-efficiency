module.exports = {
  'M': [
    {
      {
        instruction: "Your task is to press two keys that are shown on the screen using two fingers of the same hand."
      },
      {
        instruction: "1. You are shown 2 keys. ",
        img: "/images/MC_1.png"
      },
      {
        instruction: "2. Press down the first key.",
        img: "/images/MC_2.png"
      },
      {
        instruction: "3. Press down the second key, while still holding down the first one.",
        img: "/images/MC_3.png"
      },
      {
        instruction: "4. Release the first key.",
        img: "/images/MC_4.png"
      },
      {
        instruction: "5. Release the second key.",
        img: "/images/MC_5.png"
      },
      { instruction: "Repeat this 5 times." },
      { instruction: '' },
      { instruction: "Please use your left hand for the left side of the keyboard and right hand for the right side of the keyboard."},
      { instruction: "DO NOT use the thumbs, keep them over the space bar."},
      { instruction: '' },
      { instruction: "After that, you will be shown a nonsense word. Type out the word as fast as possible. Repeat the word 5 times. "},
      { instruction: "Note: the word contains the two letters you practiced before. Please use the same fingers to type them."}
    }
  ],
  'V': [
    { text: "Your task is to visually locate letters on an image of a keyboard, and then click them using the mouse." },
    {
      text: "1. You will first see a letter at a random location on the screen. Using the mouse, click the letter. This brings up a picture of a keyboard.",
      img: "/images/VS_1.png"
    },
    {
      text: "2. Move your gaze to the key that corresponds to the letter that you clicked (DO NOT MOVE THE MOUSE YET).",
      img: "/images/Vs_2.png"
    },
    {
      text: "3. When you have found the key, move the mouse in a straight line to the key and click it. Then the next letter will appear.",
      img: "/images/Vs_3.png"
    }
  ],
  'A': [
    { text: "Your task is to type the shown sentences and react to changes on the screen as fast as possible." },
    { text: "1. Start typing the shown phrase as fast and accurately as possible." },
    {
      text: "2. While you are typing, a rectangle will appear at the top of the screen every couple of seconds. When this occurs, press the LEFT Ctrl key as fast as possible.",
      img: "/images/SoA_2.png"
    },
    {
      text: "3. Immediately resume typing after pressing the Ctrl key. "
    },
    {
      text: "4. You should press the LEFT Ctrl key within 2 seconds after the rectangle appears, or the screen will turn black. If that happens, press the Ctrl key to continue the exercise. ",
      img: "/images/SoA_3.png"},
    {
      text: "5. Press Enter when you finish the phrase to bring up the next one.",
      img: "/images/SoA_5.png"
    }
  ],
}
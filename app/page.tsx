'use client'

import { GameLoader } from "./componentes/game-loader";
import { GameMessage } from "./componentes/game-message";
import { useZombieGame } from "./hooks/use-zombie-game";

export default function Home() {
  const {
    messages,
    input,
    isLoading,
    startGame,
    handleSubmit,
    handleInputChange,
  } = useZombieGame();
  return (
    <div className="font-sans min-h-screen p-8 max-w-xl mx-auto">
      {
        isLoading && <GameLoader />
      }
      {
        messages.map((message) => (
          <GameMessage key={message.id} message={message} />
        ))
      }
    </div>
  );
}

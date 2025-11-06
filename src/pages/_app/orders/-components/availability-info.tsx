export const AvailabilityInfo = () => {
  return (
    <div className="p-1">
      <div className="flex flex-col space-y-6 mt-2">
        <div>
          <span className="mr-2 bg-emerald-500 text-white px-2 py-1.5 rounded text-xs">
            C
          </span>
          <span>
            <strong>Confirmado: </strong>
            Produto disponível no estoque
          </span>
        </div>
        <div>
          <span className="mr-2 bg-red-300 text-white px-2 py-1.5 rounded text-xs">
            B
          </span>
          <span>
            <strong>BackOrder: </strong>
            Produto Indisponível no estoque
          </span>
        </div>
        <div>
          <span className="mr-2 ml-4 bg-red-500 text-white px-2 py-1.5 rounded text-xs">
            B2
          </span>
          <strong>BackOrder B2: </strong>
          Produto em Tropicalização
        </div>
        <div>
          <span className="mr-2 ml-4 bg-pink-500 text-white px-2 py-1.5 rounded text-xs">
            B3
          </span>
          <strong>BackOrder B3: </strong>
          Produto Indisponível no estoque com previsão de chegada
        </div>
        <div>
          <span className="mr-2 ml-4 bg-purple-500 text-white px-2 py-1.5 rounded text-xs">
            B4
          </span>
          <strong>BackOrder B4: </strong>
          Produto Indisponível no estoque e sem previsão de chegada
        </div>

        <div>
          <span className="mr-2 bg-blue-300 text-white px-2 py-1.5 rounded text-xs">
            P
          </span>
          <span>Parcial</span>
        </div>
      </div>
    </div>
  );
};

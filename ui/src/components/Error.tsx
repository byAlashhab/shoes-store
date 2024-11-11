function Error() {
  return (
    <div className="w-screen h-screen">
      
      <div className="absolute inset-0 m-auto w-fit h-fit font-mono">
        <img className="size-16 mx-auto mb-3" src="../SVGs/404.svg" alt="" />
        <p>Something went wrong</p>
      </div>

    </div>
  );
}

export default Error;

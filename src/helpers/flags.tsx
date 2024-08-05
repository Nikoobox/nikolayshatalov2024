const getFlagNamePerEnvironment = ({
  flagTest,
  flagProd,
}: {
  flagTest: string;
  flagProd: string;
}): string => {
  // console.log("process.env.REACT_APP_ENV", process.env.REACT_APP_ENV);

  return process.env.REACT_APP_ENV === "production" ? flagProd : flagTest;
};

export { getFlagNamePerEnvironment };

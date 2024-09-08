type FlagFuncProps = {
  flagTest: string;
  flagProd: string;
};

const getFlagNamePerEnvironment = ({
  flagTest,
  flagProd,
}: FlagFuncProps): string => {
  return process.env.REACT_APP_ENV === "production" ? flagProd : flagTest;
};

export { getFlagNamePerEnvironment };

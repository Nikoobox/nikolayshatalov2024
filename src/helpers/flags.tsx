type FlagFuncProps = {
  flagTest: string;
  flagProd: string;
};

const getFlagNamePerEnvironment = ({
  flagTest,
  flagProd,
}: FlagFuncProps): string => {
  return import.meta.env.PROD ? flagProd : flagTest;
};

export { getFlagNamePerEnvironment };

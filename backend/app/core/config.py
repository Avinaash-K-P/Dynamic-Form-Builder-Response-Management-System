from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):

    DATABASE_URL:str 

    ALGORITHM:str

    SECRET_KEY:str

    ACCESS_TOKEN_EXPIRY_MINUTES:int

    REFRESH_TOKEN_EXPIRY_DAYS:int 

    RESET_TOKEN_EXPIRY_MINUTES:int

    model_config = SettingsConfigDict(
        env_file = ".env",
        env_file_encoding="utf-8"
    )

settings = Settings() #type:ignore    
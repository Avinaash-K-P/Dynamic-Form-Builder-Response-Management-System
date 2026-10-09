import json

from app.core.redis import redis_client


def set_cache(key, data, expire=300):

    redis_client.set(
        key,
        json.dumps(data, default=str),
        ex=expire
    )


def get_cache(key):

    data = redis_client.get(key)

    if data is None:
        return None

    return json.loads(data)


def delete_cache(key):

    redis_client.delete(key)
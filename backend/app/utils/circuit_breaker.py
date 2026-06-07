import time


class CircuitBreaker:
    def __init__(self, failure_threshold: int, recovery_seconds: int):
        self.failure_threshold = failure_threshold
        self.recovery_seconds = recovery_seconds
        self.failures = 0
        self.opened_at = None

    def call(self, func, *args, **kwargs):
        if self.opened_at is not None:
            elapsed = time.time() - self.opened_at
            if elapsed < self.recovery_seconds:
                raise RuntimeError("Circuit breaker is open")
            self.opened_at = None
            self.failures = 0

        try:
            result = func(*args, **kwargs)
        except Exception:
            self.failures += 1
            if self.failures >= self.failure_threshold:
                self.opened_at = time.time()
            raise

        self.failures = 0
        return result

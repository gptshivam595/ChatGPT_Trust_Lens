import type { FastifyRequest } from "fastify";

type RouteCounter = Record<string, number>;

export type MetricsSnapshot = {
  requests: {
    total: number;
    byRoute: RouteCounter;
    byStatusCode: RouteCounter;
  };
  errors: {
    total: number;
  };
  latency: {
    averageMs: number;
    samples: number;
  };
};

const routeKeyFor = (request: FastifyRequest) => {
  const method = request.method.toUpperCase();
  const route = request.routeOptions.url ?? request.url;
  return `${method} ${route}`;
};

export class MetricsCollector {
  private readonly startTimes = new WeakMap<FastifyRequest, number>();
  private totalRequests = 0;
  private totalErrors = 0;
  private totalLatencyMs = 0;
  private latencySamples = 0;
  private readonly byRoute: RouteCounter = {};
  private readonly byStatusCode: RouteCounter = {};

  markStart(request: FastifyRequest) {
    this.startTimes.set(request, Date.now());
  }

  markComplete(request: FastifyRequest, statusCode: number) {
    this.totalRequests += 1;

    const routeKey = routeKeyFor(request);
    this.byRoute[routeKey] = (this.byRoute[routeKey] ?? 0) + 1;

    const statusKey = String(statusCode);
    this.byStatusCode[statusKey] = (this.byStatusCode[statusKey] ?? 0) + 1;

    if (statusCode >= 400) {
      this.totalErrors += 1;
    }

    const startedAt = this.startTimes.get(request);
    if (startedAt) {
      this.totalLatencyMs += Date.now() - startedAt;
      this.latencySamples += 1;
    }
  }

  snapshot(): MetricsSnapshot {
    return {
      requests: {
        total: this.totalRequests,
        byRoute: { ...this.byRoute },
        byStatusCode: { ...this.byStatusCode }
      },
      errors: {
        total: this.totalErrors
      },
      latency: {
        averageMs:
          this.latencySamples === 0 ? 0 : Math.round(this.totalLatencyMs / this.latencySamples),
        samples: this.latencySamples
      }
    };
  }
}

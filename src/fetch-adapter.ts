import { HttpClient } from '@http-client.ts'

export class FetchAdapter implements HttpClient {
  async get(url: string): Promise<HttpClient.Response> {
    return this.request('GET', url)
  }

  async post(url: string, body: unknown): Promise<HttpClient.Response> {
    return this.request('POST', url, body)
  }

  async put(url: string, body: unknown): Promise<HttpClient.Response> {
    return this.request('PUT', url, body)
  }

  async delete(url: string): Promise<HttpClient.Response> {
    return this.request('DELETE', url)
  }

  private async request(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    body?: unknown,
  ): Promise<HttpClient.Response> {
    const response = await fetch(url, {
      method,
      body: body ? JSON.stringify(body) : undefined,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    const responseBody = await this.parseBody(response)

    return {
      statusCode: response.status,
      body: responseBody,
    }
  }

  private async parseBody(response: Response): Promise<unknown> {
    const text = await response.text()
    if (!text) return ''

    return JSON.parse(text)
  }
}

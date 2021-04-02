# TriggerCD Github Action

This action will trigger a TriggerCD compatible endpoint.

## Inputs

### `url`

**Required** The websocket endpoint to connect to. Example: `ws://triggercd.example.com:4500/`

### `nonce`

**Optional** A nonce to send before a connection is established. Nonces are used to ensure that just simply having the
endpoint to the service isn't enough to trigger an unwanted rebuild.

## Outputs

## Example Usage

```
uses: SirJosh3917/triggercd-action@v0.1
with:
  url: ws://triggercd.example.com:4500/
  nonce: ihuoasfduhifdesajkblfdsjknfgdukhfgsdiuhorsbkjhdfgshjkfdbvuihortdhjkregjhkbdsg
```

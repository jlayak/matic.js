import Web3 from 'web3'
import { SendOptions } from '../types/Common'

export default class Web3Client {
  public parentWeb3: Web3
  public web3: Web3
  public parentDefaultOptions: SendOptions
  public maticDefaultOptions: SendOptions

  constructor(parentProvider, maticProvider, parentDefaultOptions, maticDefaultOptions) {
    this.parentWeb3 = new Web3(parentProvider)
    this.web3 = new Web3(maticProvider)
    this.parentDefaultOptions = parentDefaultOptions
    this.maticDefaultOptions = maticDefaultOptions
  }

  async call(method, options?: SendOptions) {
    return method.call(options || this.parentDefaultOptions)
  }

  async send(method, options?) {
    const _options = options || this.parentDefaultOptions
    // since we use the delegated proxy patterns, the following should be a good way to provide enough gas
    // apparently even when provided with a buffer of 20k, the call reverts. This shouldn't be happening because the actual gas used is less than what the estimation returns
    // providing higher buffer for now
    if (!_options.from) return new Error('from is not specified')
    console.log(_options)
    // _options.gas = (await method.estimateGas()) + 200000
    return method.send(_options)
  }

  async callOnMatic(method, options?) {
    return method.call(options || this.maticDefaultOptions)
  }

  async sendOnMatic(method, options?) {
    const _options = options || this.maticDefaultOptions
    if (!_options.from) return new Error('from is not specified')
    console.log(_options)
    // _options.gas = await method.estimateGas()
    return method.send(_options)
  }

  getParentWeb3() {
    return this.parentWeb3
  }

  getMaticWeb3() {
    return this.web3
  }

  setParentDefaultOptions(options: any) {
    this.parentDefaultOptions = options
  }

  setMaticDefaultOptions(options: any) {
    this.maticDefaultOptions = options
  }
}

from test_plus.test import TestCase
import logging, sys
logging.basicConfig(level=logging.DEBUG, stream=sys.stdout)
from web3 import Web3, HTTPProvider, TestRPCProvider, EthereumTesterProvider
from solc import compile_source
from web3.contract import ConciseContract

logger = logging.getLogger('.'.join(__file__.split('/')[-2:]).rstrip('.py'))


class TestUserUpdateView(TestCase):
    def setUp(self):
        # call BaseUserTestCase.setUp()
        super(TestUserUpdateView, self).setUp()
        self.contract_source_code = '''
                    pragma solidity ^0.4.0;

                    contract Greeter {
                        string public greeting;

                        function Greeter() {
                            greeting = 'Hello';
                        }

                        function setGreeting(string _greeting) public {
                            greeting = _greeting;
                        }

                        function greet() constant returns (string) {
                            return greeting;
                        }
                    }
                    '''
        compiled_sol = compile_source(self.contract_source_code)  # Compiled source code
        self.contract_interface = compiled_sol['<stdin>:Greeter']

        # web3.py instance
        self.w3 = Web3(EthereumTesterProvider())

    def test_make_sure_contract_is_deployed(self):
        '''
        this test deploys a contract to the test provider, then checks that the transaction
        :return:
        '''
        # Instantiate and deploy contract
        contract = self.w3.eth.contract(abi=self.contract_interface['abi'], bytecode=self.contract_interface['bin'])
        # Get transaction hash from deployed contract
        tx_hash = contract.deploy(transaction={'from': self.w3.eth.accounts[0], 'gas': 410000})
        # Get tx receipt to get contract address
        tx_receipt = self.w3.eth.getTransactionReceipt(tx_hash)
        contract_address = tx_receipt['contractAddress']
        print(contract_address)
        self.assertTrue(contract_address)
        # print(tx_receipt)

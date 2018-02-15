import os

from django.apps import AppConfig
from solc import compile_standard
from solc import compile_source

class UsersConfig(AppConfig):
    name = 'ether_ready_py.users'
    verbose_name = "Users"

    def ready(self):
        """Override this to put in:
            Users system checks
            Users signal registration
        """
        d = {
            'language': 'Solidity',
            'sources': ['solidity/test.sol']
        }
        # print(compile_standard('solidity/test.sol'))

        os.environ['SOLC_BINARY'] = '/root/.py-solc/solc-v0.4.19/bin/solc'
        compilation = compile_source(open('/app/solidity/test.sol').read())['<stdin>:Inbox']
        print(compilation)

        pass

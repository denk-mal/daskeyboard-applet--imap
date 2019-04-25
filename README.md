# IMAP Checker

Display the state of unread emails in an imap account

This plugin will check for emails on an IMAP Server; it is possible
to set the checked imap folder and the check time.

**POC (Proof of Concept); I will not using this neither will I made some
ongoing developments due to the security drawback of node.js handling of
root-ca**

## tl;dr
This plugin may or may not work with your imap server depending on the
ssl certificate that is used by your imap server.

Node.js (the base technology behind the Q-Applets) has all root-ca
hard-coded in its framework and so only root-ca that are in the
installation of this applet are valid (forever). New, revoked, rejected or
expired root-ca will not left or reach this applet except this project is
rebuild with a new (actual) node.js environment.

Furthermore if you have a self-signed (company/enterprise wide) root-ca
on your computer it will not respected by node.js. For now there are 3
ways around this:
1. set the environment var NODE_EXTRA_CA_CERTS; This is not working
because node.js is ignoring ths var when the process is running as root.
2. adding your root-ca fixed or 'on-the-fly' to the ca-certificate store;
I haven't find a working solution for now.
3. set a tlsoption to ignore the validity of the ssl certificate; **Don't do
this!**

I for myself will choose another programming language respectively another
framework to implement those check (python?) so please stay tuned.


## Copyright / License

Licensed under the GNU General Public License Version 2.0 (or later);
you may not use this work except in compliance with the License.
You may obtain a copy of the License in the LICENSE file, or at:

   http://www.gnu.org/licenses/old-licenses/gpl-2.0.txt

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

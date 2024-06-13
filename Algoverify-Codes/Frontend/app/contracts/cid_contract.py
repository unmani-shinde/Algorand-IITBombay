import beaker as bk
import pyteal as pt

class CIDState:
    SCID = bk.GlobalStateValue(pt.TealType.bytes)

app = bk.Application("SCID_app", state = CIDState())

@app.external
def update_SCID(cid: pt.abi.String) -> pt.Expr:
        return app.state.SCID.set(cid.get())

@app.external
def read_cids(*, output: pt.abi.String) -> pt.Expr:
        return output.set(app.state.SCID)

if __name__ == "__main__":
    spec = app.build()
    spec.export("artifacts")
    print("global states:\n", spec.schema)
export const idlFactory = ({ IDL }) => {
  const ProduceId = IDL.Nat;
  const Result_1 = IDL.Variant({ 'ok' : ProduceId, 'err' : IDL.Text });
  const Stakeholder = IDL.Text;
  const Time = IDL.Int;
  const Transaction = IDL.Record({
    'to' : Stakeholder,
    'from' : IDL.Opt(Stakeholder),
    'timestamp' : Time,
    'details' : IDL.Text,
  });
  const Produce = IDL.Record({
    'id' : ProduceId,
    'quality' : IDL.Text,
    'origin' : IDL.Text,
    'history' : IDL.Vec(Transaction),
    'currentOwner' : Stakeholder,
    'registeredTime' : Time,
    'produceType' : IDL.Text,
    'price' : IDL.Nat,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  return IDL.Service({
    'addProduce' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Nat, IDL.Text],
        [Result_1],
        [],
      ),
    'getAllProduces' : IDL.Func([], [IDL.Vec(Produce)], ['query']),
    'getProduceTrace' : IDL.Func([ProduceId], [IDL.Opt(Produce)], ['query']),
    'getProducesByOwner' : IDL.Func([IDL.Text], [IDL.Vec(Produce)], ['query']),
    'transferProduce' : IDL.Func(
        [ProduceId, IDL.Text, IDL.Text, IDL.Text, IDL.Nat],
        [Result],
        [],
      ),
    'verifyStakeholderInTrace' : IDL.Func(
        [ProduceId, IDL.Text],
        [IDL.Bool],
        ['query'],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
